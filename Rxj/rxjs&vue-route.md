---
url: /grady/Rxj/rxjs&vue-route.md
---
```ts rxRouter.ts
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { Router, RouteLocationNormalized } from 'vue-router';

export class RxRouter {
  private router: Router;
  private currentRoute$ = new BehaviorSubject<RouteLocationNormalized | null>(null);

  constructor(router: Router) {
    this.router = router;
    
    // 监听路由变化并更新 BehaviorSubject
    this.router.afterEach((to) => {
      this.currentRoute$.next(to);
    });
  }

  // 获取当前路由的 Observable
  public getRoute(): Observable<RouteLocationNormalized> {
    return this.currentRoute$.pipe(
      filter((route): route is RouteLocationNormalized => route !== null)
    );
  }

  // 获取特定路由参数的 Observable
  public getParam(paramName: string): Observable<string | undefined> {
    return this.getRoute().pipe(
      map(route => route.params[paramName] as string | undefined)
    );
  }

  // 获取特定查询参数的 Observable
  public getQuery(queryName: string): Observable<string | undefined> {
    return this.getRoute().pipe(
      map(route => route.query[queryName] as string | undefined)
    );
  }

  // 导航方法
  public navigate(path: string, query?: Record<string, string>): Promise<void> {
    return this.router.push({ path, query });
  }

  // 替换当前路由
  public replace(path: string, query?: Record<string, string>): Promise<void> {
    return this.router.replace({ path, query });
  }
}

```

## 接下来，创建一个路由配置管理器：

```ts routeConfig.ts
import { RouteRecordRaw } from 'vue-router';
import { BehaviorSubject, Observable } from 'rxjs';

// 扩展的路由配置接口
export interface EnhancedRouteConfig extends RouteRecordRaw {
  permissions?: string[];
  meta?: {
    title?: string;
    icon?: string;
    hidden?: boolean;
    [key: string]: any;
  };
}

export class RouteConfigManager {
  private routeConfigs$ = new BehaviorSubject<EnhancedRouteConfig[]>([]);
  
  constructor(initialRoutes: EnhancedRouteConfig[] = []) {
    this.routeConfigs$.next(initialRoutes);
  }

  // 获取路由配置的 Observable
  public getRouteConfigs(): Observable<EnhancedRouteConfig[]> {
    return this.routeConfigs$.asObservable();
  }

  // 添加路由配置
  public addRouteConfig(config: EnhancedRouteConfig): void {
    const currentConfigs = this.routeConfigs$.getValue();
    this.routeConfigs$.next([...currentConfigs, config]);
  }

  // 批量添加路由配置
  public addRouteConfigs(configs: EnhancedRouteConfig[]): void {
    const currentConfigs = this.routeConfigs$.getValue();
    this.routeConfigs$.next([...currentConfigs, ...configs]);
  }

  // 根据路径获取路由配置
  public getRouteConfigByPath(path: string): EnhancedRouteConfig | undefined {
    return this.findRouteConfigByPath(this.routeConfigs$.getValue(), path);
  }

  // 递归查找路由配置
  private findRouteConfigByPath(
    configs: EnhancedRouteConfig[], 
    path: string
  ): EnhancedRouteConfig | undefined {
    for (const config of configs) {
      if (config.path === path) {
        return config;
      }
      
      if (config.children) {
        const found = this.findRouteConfigByPath(config.children as EnhancedRouteConfig[], path);
        if (found) {
          return found;
        }
      }
    }
    
    return undefined;
  }
}
```

## 权限管理集成

创建一个权限管理服务，与路由结合：

```typescript permissionService.ts

import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { RouteConfigManager, EnhancedRouteConfig } from './routeConfig';

export class PermissionService {
  private userPermissions$ = new BehaviorSubject<string[]>([]);
  private routeConfigManager: RouteConfigManager;
  
  constructor(routeConfigManager: RouteConfigManager) {
    this.routeConfigManager = routeConfigManager;
  }

  // 设置用户权限
  public setUserPermissions(permissions: string[]): void {
    this.userPermissions$.next(permissions);
  }

  // 获取用户权限
  public getUserPermissions(): Observable<string[]> {
    return this.userPermissions$.asObservable();
  }

  // 检查用户是否有特定权限
  public hasPermission(permission: string): Observable<boolean> {
    return this.userPermissions$.pipe(
      map(permissions => permissions.includes(permission))
    );
  }

  // 获取用户有权限访问的路由
  public getAccessibleRoutes(): Observable<EnhancedRouteConfig[]> {
    return combineLatest([
      this.routeConfigManager.getRouteConfigs(),
      this.userPermissions$
    ]).pipe(
      map(([routes, permissions]) => 
        this.filterAccessibleRoutes(routes, permissions)
      )
    );
  }

  // 递归过滤有权限的路由
  private filterAccessibleRoutes(
    routes: EnhancedRouteConfig[], 
    permissions: string[]
  ): EnhancedRouteConfig[] {
    return routes.filter(route => {
      // 如果路由没有权限要求，或者用户拥有所需权限
      const hasPermission = !route.permissions || 
        route.permissions.some(p => permissions.includes(p));
      
      if (!hasPermission) {
        return false;
      }
      
      // 递归处理子路由
      if (route.children) {
        const filteredChildren = this.filterAccessibleRoutes(
          route.children as EnhancedRouteConfig[], 
          permissions
        );
        
        // 克隆路由对象并替换子路由
        return {
          ...route,
          children: filteredChildren
        };
      }
      
      return true;
    });
  }
}


```

## 路由守卫集成

创建一个基于 RxJS 的路由守卫：

```typescript routeGuard.ts
import { Router } from 'vue-router';
import { Observable, firstValueFrom } from 'rxjs';
import { PermissionService } from './permissionService';
import { RxRouter } from './rxRouter';

export class RouteGuard {
  private router: Router;
  private rxRouter: RxRouter;
  private permissionService: PermissionService;
  
  constructor(
    router: Router, 
    rxRouter: RxRouter, 
    permissionService: PermissionService
  ) {
    this.router = router;
    this.rxRouter = rxRouter;
    this.permissionService = permissionService;
    
    this.setupGuards();
  }
  
  private setupGuards(): void {
    this.router.beforeEach(async (to, from, next) => {
      // 检查路由是否需要权限
      const routeConfig = to.matched.find(record => 
        record.meta.permissions && record.meta.permissions.length > 0
      );
      
      if (!routeConfig) {
        // 不需要权限，直接通过
        next();
        return;
      }
      
      // 获取路由所需权限
      const requiredPermissions = routeConfig.meta.permissions as string[];
      
      // 检查用户是否有权限
      const userPermissions = await firstValueFrom(
        this.permissionService.getUserPermissions()
      );
      
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
      
      if (hasPermission) {
        next();
      } else {
        // 无权限，重定向到无权限页面
        next({ path: '/unauthorized' });
      }
    });
  }
}
```

## 使用示例

最后，创建一个使用示例：

```typescript index.ts

import { createRouter, createWebHistory } from 'vue-router';
import { RxRouter } from './rxRouter';
import { RouteConfigManager, EnhancedRouteConfig } from './routeConfig';
import { PermissionService } from './permissionService';
import { RouteGuard } from './routeGuard';

// 基础路由配置
const baseRoutes: EnhancedRouteConfig[] = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'home'
    }
  },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    permissions: ['view-dashboard'],
    meta: {
      title: '仪表盘',
      icon: 'dashboard'
    }
  },
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    permissions: ['admin'],
    meta: {
      title: '管理',
      icon: 'admin'
    },
    children: [
      {
        path: 'users',
        component: () => import('../views/Users.vue'),
        permissions: ['manage-users'],
        meta: {
          title: '用户管理'
        }
      }
    ]
  },
  {
    path: '/unauthorized',
    component: () => import('../views/Unauthorized.vue'),
    meta: {
      title: '无权限',
      hidden: true
    }
  }
];

// 创建 Vue Router 实例
const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes as any
});

// 创建 RxRouter 实例
const rxRouter = new RxRouter(router);

// 创建路由配置管理器
const routeConfigManager = new RouteConfigManager(baseRoutes);

// 创建权限服务
const permissionService = new PermissionService(routeConfigManager);

// 创建路由守卫
const routeGuard = new RouteGuard(router, rxRouter, permissionService);

// 设置用户权限（通常在用户登录后设置）
permissionService.setUserPermissions(['view-dashboard', 'admin']);

export { 
  router, 
  rxRouter, 
  routeConfigManager, 
  permissionService 
};

```

## 在组件中使用

```vue Navigation.vue

<template>
  <div class="navigation">
    <ul>
      <li v-for="route in accessibleRoutes" :key="route.path">
        <router-link :to="route.path">
          <i v-if="route.meta?.icon" :class="route.meta.icon"></i>
          {{ route.meta?.title || route.path }}
        </router-link>
        
        <ul v-if="route.children && route.children.length">
          <li v-for="child in route.children" :key="child.path">
            <router-link :to="`${route.path}/${child.path}`">
              {{ child.meta?.title || child.path }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { permissionService } from '../router';
import { EnhancedRouteConfig } from '../router/routeConfig';

export default defineComponent({
  name: 'Navigation',
  setup() {
    const accessibleRoutes = ref<EnhancedRouteConfig[]>([]);
    
    onMounted(() => {
      // 订阅可访问路由的变化
      const subscription = permissionService.getAccessibleRoutes().subscribe(routes => {
        // 过滤掉隐藏的路由
        accessibleRoutes.value = routes.filter(route => !route.meta?.hidden);
      });
      
      // 组件卸载时取消订阅
      return () => subscription.unsubscribe();
    });
    
    return {
      accessibleRoutes
    };
  }
});
</script>

```

## 动态添加路由示例

```typescript dynamicRouteService.ts


import { routeConfigManager, router, permissionService } from '../router';
import { EnhancedRouteConfig } from '../router/routeConfig';

export class DynamicRouteService {
  // 从后端加载路由配置
  public async loadRoutesFromBackend(): Promise<void> {
    try {
      // 模拟从后端获取路由配置
      const response = await fetch('/api/routes');
      const dynamicRoutes: EnhancedRouteConfig[] = await response.json();
      
      // 添加到路由配置管理器
      routeConfigManager.addRouteConfigs(dynamicRoutes);
      
      // 获取用户有权限的路由
      const accessibleRoutes = await new Promise<EnhancedRouteConfig[]>(resolve => {
        const subscription = permissionService.getAccessibleRoutes().subscribe(routes => {
          resolve(routes);
          subscription.unsubscribe();
        });
      });
      
      // 动态添加到 Vue Router
      accessibleRoutes.forEach(route => {
        if (!router.hasRoute(route.name as string)) {
          router.addRoute(route as any);
        }
      });
      
      console.log('动态路由加载完成');
    } catch (error) {
      console.error('加载动态路由失败:', error);
    }
  }
}
```

## 总结

通过以上代码，我们实现了：

1. 使用 RxJS 封装 Vue Router，提供响应式的路由状态
2. 创建路由配置管理器，支持动态添加和修改路由
3. 集成权限管理，根据用户权限过滤路由
4. 实现基于 RxJS 的路由守卫
5. 支持动态加载路由配置
   这个架构非常灵活，可以根据实际需求进行扩展，例如添加路由缓存、路由分析等功能。

# 添加路由缓存和路由分析功能

我将为您的 RxJS 和 Vue Router 集成方案添加路由缓存和路由分析功能。这两个功能可以显著提升用户体验和帮助开发者了解用户行为。

## 1. 路由缓存服务

首先，让我们创建一个路由缓存服务，用于保存和恢复路由状态：

```typescript
import { BehaviorSubject, Observable } from 'rxjs';
import { RouteLocationNormalized } from 'vue-router';
import { RxRouter } from './rxRouter';

interface CachedRouteState {
  path: string;
  query: Record<string, string>;
  params: Record<string, string>;
  scrollPosition?: { x: number; y: number };
  timestamp: number;
  data?: any; // 用于存储与路由相关的自定义数据
}

export class RouteCacheService {
  private static readonly CACHE_KEY = 'route_cache';
  private static readonly MAX_CACHE_SIZE = 20; // 最大缓存路由数量
  
  private cachedRoutes$ = new BehaviorSubject<Record<string, CachedRouteState>>({});
  private rxRouter: RxRouter;
  
  constructor(rxRouter: RxRouter) {
    this.rxRouter = rxRouter;
    this.loadCacheFromStorage();
    
    // 监听路由变化，自动缓存
    this.rxRouter.getRoute().subscribe(route => {
      this.cacheRoute(route);
    });
    
    // 监听页面滚动，保存滚动位置
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveScrollPosition();
      });
    }
  }
  
  // 获取缓存的路由
  public getCachedRoutes(): Observable<Record<string, CachedRouteState>> {
    return this.cachedRoutes$.asObservable();
  }
  
  // 缓存当前路由
  private cacheRoute(route: RouteLocationNormalized): void {
    const cachedRoutes = this.cachedRoutes$.getValue();
    const routeKey = this.getRouteKey(route);
    
    // 创建缓存对象
    const cacheState: CachedRouteState = {
      path: route.path,
      query: { ...route.query } as Record<string, string>,
      params: { ...route.params } as Record<string, string>,
      timestamp: Date.now(),
      scrollPosition: this.getCurrentScrollPosition()
    };
    
    // 更新缓存
    const updatedCache = {
      ...cachedRoutes,
      [routeKey]: cacheState
    };
    
    // 如果缓存过大，删除最旧的缓存
    const cacheEntries = Object.entries(updatedCache);
    if (cacheEntries.length > RouteCacheService.MAX_CACHE_SIZE) {
      const sortedEntries = cacheEntries.sort((a, b) => 
        a[1].timestamp - b[1].timestamp
      );
      
      // 删除最旧的条目
      const oldestKey = sortedEntries[0][0];
      delete updatedCache[oldestKey];
    }
    
    this.cachedRoutes$.next(updatedCache);
    this.saveCacheToStorage();
  }
  
  // 保存自定义数据到路由缓存
  public saveRouteData(routePath: string, data: any): void {
    const cachedRoutes = this.cachedRoutes$.getValue();
    const routeKey = Object.keys(cachedRoutes).find(key => 
      cachedRoutes[key].path === routePath
    );
    
    if (routeKey) {
      cachedRoutes[routeKey].data = data;
      this.cachedRoutes$.next({ ...cachedRoutes });
      this.saveCacheToStorage();
    }
  }
  
  // 获取路由缓存的自定义数据
  public getRouteData(routePath: string): any | undefined {
    const cachedRoutes = this.cachedRoutes$.getValue();
    const routeKey = Object.keys(cachedRoutes).find(key => 
      cachedRoutes[key].path === routePath
    );
    
    return routeKey ? cachedRoutes[routeKey].data : undefined;
  }
  
  // 恢复路由状态
  public restoreRoute(routePath: string): boolean {
    const cachedRoutes = this.cachedRoutes$.getValue();
    const routeKey = Object.keys(cachedRoutes).find(key => 
      cachedRoutes[key].path === routePath
    );
    
    if (!routeKey) {
      return false;
    }
    
    const cachedRoute = cachedRoutes[routeKey];
    
    // 导航到缓存的路由
    this.rxRouter.navigate(cachedRoute.path, cachedRoute.query);
    
    // 恢复滚动位置
    if (cachedRoute.scrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: cachedRoute.scrollPosition!.y,
          left: cachedRoute.scrollPosition!.x,
          behavior: 'auto'
        });
      }, 100);
    }
    
    return true;
  }
  
  // 清除特定路由的缓存
  public clearRouteCache(routePath: string): void {
    const cachedRoutes = this.cachedRoutes$.getValue();
    const routeKey = Object.keys(cachedRoutes).find(key => 
      cachedRoutes[key].path === routePath
    );
    
    if (routeKey) {
      const updatedCache = { ...cachedRoutes };
      delete updatedCache[routeKey];
      this.cachedRoutes$.next(updatedCache);
      this.saveCacheToStorage();
    }
  }
  
  // 清除所有缓存
  public clearAllCache(): void {
    this.cachedRoutes$.next({});
    localStorage.removeItem(RouteCacheService.CACHE_KEY);
  }
  
  // 获取路由的唯一键
  private getRouteKey(route: RouteLocationNormalized): string {
    return `${route.path}${JSON.stringify(route.query)}`;
  }
  
  // 获取当前滚动位置
  private getCurrentScrollPosition(): { x: number; y: number } {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset
    };
  }
  
  // 保存当前滚动位置
  private saveScrollPosition(): void {
    const cachedRoutes = this.cachedRoutes$.getValue();
    const currentRoute = this.rxRouter.getCurrentRoute();
    
    if (!currentRoute) {
      return;
    }
    
    const routeKey = this.getRouteKey(currentRoute);
    if (cachedRoutes[routeKey]) {
      cachedRoutes[routeKey].scrollPosition = this.getCurrentScrollPosition();
      this.cachedRoutes$.next({ ...cachedRoutes });
      this.saveCacheToStorage();
    }
  }
  
  // 将缓存保存到 localStorage
  private saveCacheToStorage(): void {
    try {
      localStorage.setItem(
        RouteCacheService.CACHE_KEY, 
        JSON.stringify(this.cachedRoutes$.getValue())
      );
    } catch (error) {
      console.error('保存路由缓存失败:', error);
    }
  }
  
  // 从 localStorage 加载缓存
  private loadCacheFromStorage(): void {
    try {
      const cachedData = localStorage.getItem(RouteCacheService.CACHE_KEY);
      if (cachedData) {
        this.cachedRoutes$.next(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error('加载路由缓存失败:', error);
      // 如果加载失败，清除可能损坏的缓存
      localStorage.removeItem(RouteCacheService.CACHE_KEY);
    }
  }
}
```

## 2. 路由分析服务

接下来，创建一个路由分析服务，用于跟踪和分析用户的路由行为：

```typescript

import { Observable, Subject, filter, map, pairwise, startWith } from 'rxjs';
import { RouteLocationNormalized } from 'vue-router';
import { RxRouter } from './rxRouter';

export interface RouteTransition {
  from: RouteLocationNormalized | null;
  to: RouteLocationNormalized;
  timestamp: number;
  duration?: number; // 停留时间（毫秒）
}

export interface RouteAnalytics {
  path: string;
  visits: number;
  averageDuration: number; // 平均停留时间（毫秒）
  lastVisit: number; // 最后访问时间戳
}

export class RouteAnalyticsService {
  private static readonly ANALYTICS_KEY = 'route_analytics';
  private static readonly MAX_TRANSITIONS = 100; // 最大记录的路由转换数量
  
  private routeTransitions: RouteTransition[] = [];
  private routeAnalytics: Record<string, RouteAnalytics> = {};
  private transitionSubject = new Subject<RouteTransition>();
  
  constructor(private rxRouter: RxRouter) {
    this.loadAnalyticsFromStorage();
    
    // 监听路由变化
    this.rxRouter.getRoute().pipe(
      startWith(null),
      pairwise(),
      filter(([from, to]) => to !== null)
    ).subscribe(([from, to]) => {
      if (to) {
        this.recordTransition(from as RouteLocationNormalized | null, to as RouteLocationNormalized);
      }
    });
  }
  
  // 获取路由转换的 Observable
  public getRouteTransitions(): Observable<RouteTransition> {
    return this.transitionSubject.asObservable();
  }
  
  // 获取特定路径的分析数据
  public getRouteAnalytics(path: string): RouteAnalytics | undefined {
    return this.routeAnalytics[path];
  }
  
  // 获取所有路径的分析数据
  public getAllRouteAnalytics(): Record<string, RouteAnalytics> {
    return { ...this.routeAnalytics };
  }
  
  // 获取最常访问的路由
  public getMostVisitedRoutes(limit: number = 5): RouteAnalytics[] {
    return Object.values(this.routeAnalytics)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, limit);
  }
  
  // 获取停留时间最长的路由
  public getLongestDurationRoutes(limit: number = 5): RouteAnalytics[] {
    return Object.values(this.routeAnalytics)
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, limit);
  }
  
  // 获取最近访问的路由
  public getRecentlyVisitedRoutes(limit: number = 5): RouteAnalytics[] {
    return Object.values(this.routeAnalytics)
      .sort((a, b) => b.lastVisit - a.lastVisit)
      .slice(0, limit);
  }
  
  // 记录路由转换
  private recordTransition(from: RouteLocationNormalized | null, to: RouteLocationNormalized): void {
    const now = Date.now();
    
    // 创建转换记录
    const transition: RouteTransition = {
      from,
      to,
      timestamp: now
    };
    
    // 如果有前一个路由，计算停留时间
    if (from && this.routeTransitions.length > 0) {
      const lastTransition = this.routeTransitions[this.routeTransitions.length - 1];
      const duration = now - lastTransition.timestamp;
      
      // 更新前一个转换的停留时间
      lastTransition.duration = duration;
      
      // 更新分析数据
      this.updateRouteAnalytics(from.path, duration);
    }
    
    // 添加新的转换记录
    this.routeTransitions.push(transition);
    
    // 如果记录过多，删除最旧的
    if (this.routeTransitions.length > RouteAnalyticsService.MAX_TRANSITIONS) {
      this.routeTransitions.shift();
    }
    
    // 发布转换事件
    this.transitionSubject.next(transition);
    
    // 保存分析数据
    this.saveAnalyticsToStorage();
  }
  
  // 更新路由分析数据
  private updateRouteAnalytics(path: string, duration: number): void {
    if (!this.routeAnalytics[path]) {
      this.routeAnalytics[path] = {
        path,
        visits: 0,
        averageDuration: 0,
        lastVisit: Date.now()
      };
    }
    
    const analytics = this.routeAnalytics[path];
    
    // 更新访问次数和最后访问时间
    analytics.visits += 1;
    analytics.lastVisit = Date.now();
    
    // 更新平均停留时间
    analytics.averageDuration = (
      (analytics.averageDuration * (analytics.visits - 1)) + duration
    ) / analytics.visits;
  }
  
  // 清除分析数据
  public clearAnalytics(): void {
    this.routeTransitions = [];
    this.routeAnalytics = {};
    localStorage.removeItem(RouteAnalyticsService.ANALYTICS_KEY);
  }
  
  // 将分析数据保存到 localStorage
  private saveAnalyticsToStorage(): void {
    try {
      localStorage.setItem(
        RouteAnalyticsService.ANALYTICS_KEY, 
        JSON.stringify(this.routeAnalytics)
      );
    } catch (error) {
      console.error('保存路由分析数据失败:', error);
    }
  }
  
  // 从 localStorage 加载分析数据
  private loadAnalyticsFromStorage(): void {
    try {
      const analyticsData = localStorage.getItem(RouteAnalyticsService.ANALYTICS_KEY);
      if (analyticsData) {
        this.routeAnalytics = JSON.parse(analyticsData);
      }
    } catch (error) {
      console.error('加载路由分析数据失败:', error);
      localStorage.removeItem(RouteAnalyticsService.ANALYTICS_KEY);
    }
  }
  
  // 导出分析数据为 JSON
  public exportAnalytics(): string {
    return JSON.stringify({
      transitions: this.routeTransitions,
      analytics: this.routeAnalytics,
      exportTime: new Date().toISOString()
    }, null, 2);
  }
}
```

## 3. 更新 RxRouter 类

首先，我们需要更新 RxRouter 类，添加获取当前路由的方法：

```typescript

import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { Router, RouteLocationNormalized } from 'vue-router';

export class RxRouter {
  private router: Router;
  private currentRoute$ = new BehaviorSubject<RouteLocationNormalized | null>(null);

  constructor(router: Router) {
    this.router = router;
    
    // 监听路由变化并更新 BehaviorSubject
    this.router.afterEach((to) => {
      this.currentRoute$.next(to);
    });
  }

  // 获取当前路由的 Observable
  public getRoute(): Observable<RouteLocationNormalized> {
    return this.currentRoute$.pipe(
      filter((route): route is RouteLocationNormalized => route !== null)
    );
  }

  // 获取当前路由对象
  public getCurrentRoute(): RouteLocationNormalized | null {
    return this.currentRoute$.getValue();
  }

  // 获取特定路由参数的 Observable
  public getParam(paramName: string): Observable<string | undefined> {
    return this.getRoute().pipe(
      map(route => route.params[paramName] as string | undefined)
    );
  }

  // 获取特定查询参数的 Observable
  public getQuery(queryName: string): Observable<string | undefined> {
    return this.getRoute().pipe(
      map(route => route.query[queryName] as string | undefined)
    );
  }

  // 导航方法
  public navigate(path: string, query?: Record<string, string>): Promise<void> {
    return this.router.push({ path, query });
  }

  // 替换当前路由
  public replace(path: string, query?: Record<string, string>): Promise<void> {
    return this.router.replace({ path, query });
  }
}
```

## 4. 集成到主路由文件

现在，让我们将路由缓存和路由分析服务集成到主路由文件中：

```typescript

import { createRouter, createWebHistory } from 'vue-router';
import { RxRouter } from './rxRouter';
import { RouteConfigManager, EnhancedRouteConfig } from './routeConfig';
import { PermissionService } from './permissionService';
import { RouteGuard } from './routeGuard';
import { RouteCacheService } from './routeCacheService';
import { RouteAnalyticsService } from './routeAnalyticsService';

// 基础路由配置
const baseRoutes: EnhancedRouteConfig[] = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'home'
    }
  },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    permissions: ['view-dashboard'],
    meta: {
      title: '仪表盘',
      icon: 'dashboard'
    }
  },
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    permissions: ['admin'],
    meta: {
      title: '管理',
      icon: 'admin'
    },
    children: [
      {
        path: 'users',
        component: () => import('../views/Users.vue'),
        permissions: ['manage-users'],
        meta: {
          title: '用户管理'
        }
      }
    ]
  },
  {
    path: '/unauthorized',
    component: () => import('../views/Unauthorized.vue'),
    meta: {
      title: '无权限',
      hidden: true
    }
  }
];

// 创建 Vue Router 实例
const router = createRouter({
  history: createWebHistory(),
  routes: baseRoutes as any
});

// 创建 RxRouter 实例
const rxRouter = new RxRouter(router);

// 创建路由配置管理器
const routeConfigManager = new RouteConfigManager(baseRoutes);

// 创建权限服务
const permissionService = new PermissionService(routeConfigManager);

// 创建路由守卫
const routeGuard = new RouteGuard(router, rxRouter, permissionService);

// 创建路由缓存服务
const routeCacheService = new RouteCacheService(rxRouter);

// 创建路由分析服务
const routeAnalyticsService = new RouteAnalyticsService(rxRouter);

// 设置用户权限（通常在用户登录后设置）
permissionService.setUserPermissions(['view-dashboard', 'admin']);

export { 
  router, 
  rxRouter, 
  routeConfigManager, 
  permissionService,
  routeCacheService,
  routeAnalyticsService
};

```

## 5. 创建路由缓存组件

```vue
<template>
  <div class="cached-route-view">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedComponents">
        <component 
          :is="Component" 
          :key="$route.fullPath"
          @cache-data="cacheComponentData"
        />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { routeCacheService } from '../router';

export default defineComponent({
  name: 'CachedRouteView',
  setup() {
    const route = useRoute();
    const cachedComponents = ref<string[]>([]);
    
    // 从路由元数据中获取需要缓存的组件
    const updateCachedComponents = () => {
      const cacheEnabled = route.meta.cache !== false; // 默认启用缓存
      
      if (cacheEnabled && route.matched.length > 0) {
        // 获取当前路由匹配的组件名称
        const componentNames = route.matched
          .filter(record => record.components?.default)
          .map(record => {
            const component = record.components?.default;
            return component.name || '';
          })
          .filter(name => name); // 过滤掉没有名称的组件
        
        // 更新缓存列表
        componentNames.forEach(name => {
          if (!cachedComponents.value.includes(name)) {
            cachedComponents.value.push(name);
          }
        });
      }
    };
    
    // 缓存组件数据
    const cacheComponentData = (data: any) => {
      if (route.path) {
        routeCacheService.saveRouteData(route.path, data);
      }
    };
    
    // 监听路由变化
    watch(() => route.path, updateCachedComponents, { immediate: true });
    
    // 初始化时尝试恢复路由状态
    onMounted(() => {
      updateCachedComponents();
    });
    
    return {
      cachedComponents,
      cacheComponentData
    };
  }
});
</script>
```

## 6. 创建路由分析仪表盘组件

```vue
<template>
  <div class="route-analytics-dashboard">
    <h2>路由分析仪表盘</h2>
    
    <div class="analytics-section">
      <h3>最常访问的路由</h3>
      <table>
        <thead>
          <tr>
            <th>路径</th>
            <th>访问次数</th>
            <th>平均停留时间</th>
            <th>最后访问</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in mostVisitedRoutes" :key="route.path">
            <td>{{ route.path }}</td>
            <td>{{ route.visits }}</td>
            <td>{{ formatDuration(route.averageDuration) }}</td>
            <td>{{ formatDate(route.lastVisit) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="analytics-section">
      <h3>停留时间最长的路由</h3>
      <table>
        <thead>
          <tr>
            <th>路径</th>
            <th>平均停留时间</th>
            <th>访问次数</th>
            <th>最后访问</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in longestDurationRoutes" :key="route.path">
            <td>{{ route.path }}</td>
            <td>{{ formatDuration(route.averageDuration) }}</td>
            <td>{{ route.visits }}</td>
            <td>{{ formatDate(route.lastVisit) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="analytics-section">
      <h3>最近访问的路由</h3>
      <table>
        <thead>
          <tr>
            <th>路径</th>
            <th>最后访问</th>
            <th>访问次数</th>
            <th>平均停留时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in recentlyVisitedRoutes" :key="route.path">
            <td>{{ route.path }}</td>
            <td>{{ formatDate(route.lastVisit) }}</td>
            <td>{{ route.visits }}</td>
            <td>{{ formatDuration(route.averageDuration) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="actions">
      <button @click="exportAnalytics">导出分析数据</button>
      <button @click="clearAnalytics" class="danger">清除分析数据</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { routeAnalyticsService } from '../router';
import { RouteAnalytics } from '../router/routeAnalyticsService';

export default defineComponent({
  name: 'RouteAnalyticsDashboard',
  setup() {
    const mostVisitedRoutes = ref<RouteAnalytics[]>([]);
    const longestDurationRoutes = ref<RouteAnalytics[]>([]);
    const recentlyVisitedRoutes = ref<RouteAnalytics[]>([]);
    
    // 格式化持续时间
    const formatDuration = (ms: number): string => {
      if (ms < 1000) {
        return `${ms}毫秒`;
      } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(1)}秒`;
      } else {
        return `${(ms / 60000).toFixed(1)}分钟`;
      }
    };
    
    // 格式化日期
    const formatDate = (timestamp: number): string => {
      return new Date(timestamp).toLocaleString();
    };
    
    // 更新分析数据
    const updateAnalytics = () => {
      mostVisitedRoutes.value = routeAnalyticsService.getMostVisitedRoutes();
      longestDurationRoutes.value = routeAnalyticsService.getLongestDurationRoutes();
      recentlyVisitedRoutes.value = routeAnalyticsService.getRecentlyVisitedRoutes();
    };
    
    // 导出分析数据
    const exportAnalytics = () => {
      const analyticsJson = routeAnalyticsService.exportAnalytics();
      const blob = new Blob([analyticsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `route-analytics-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    
    // 清除分析数据
    const clearAnalytics = () => {
      if (confirm('确定要清除所有路由分析数据吗？')) {
        routeAnalyticsService.clearAnalytics();
        updateAnalytics();
      }
    };
    
    // 初始化
    onMounted(() => {
      updateAnalytics();
      
      // 监听路由转换，实时更新分析数据
      const subscription = routeAnalyticsService.getRouteTransitions().subscribe(() => {
        updateAnalytics();
      });
      
      // 组件卸载时取消订阅
      return () => subscription.unsubscribe();
    });
    
    return {
      mostVisitedRoutes,
      longestDurationRoutes,
      recentlyVisitedRoutes,
      formatDuration,
      formatDate,
      exportAnalytics,
      clearAnalytics
    };
  }
});
</script>

<style scoped>
.route-analytics-dashboard {
  padding: 20px;
}

.analytics-section {
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.actions {
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button.danger {
  background-color: #f44336;
}

button.danger:hover {
  background-color: #d32f2f;
}
</style>
```

## 7. 创建可缓存的组件示例

下面是一个可以利用路由缓存的组件示例：

```vue
<template>
  <div class="cacheable-form">
    <h2>可缓存表单</h2>
    
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">姓名</label>
        <input type="text" id="name" v-model="formData.name" />
      </div>
      
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
```
