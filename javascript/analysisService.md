---
url: /javascript/analysisService.md
---
# 退出浏览器前，发送积压的埋点请求，该如何去做？

## 功能分析

我已经创建了一个新的埋点服务类 AnalyticsService，它具有以下特性：

1. 单例模式：确保整个应用只有一个埋点服务实例。
2. 事件队列：

* 使用队列存储待发送的埋点事件
* 支持批量发送（默认每10个事件发送一次）
* 定时发送（默认每5秒检查一次）

3. 浏览器关闭前发送：

* 使用 beforeunload 事件监听浏览器关闭
* 使用 navigator.sendBeacon API 在页面关闭时发送数据，这个 API 专门用于处理页面卸载时的数据发送
* 将所有积压的事件打包成一个请求发送

4. 错误处理：

* 如果发送失败，事件会被放回队列
* 使用 isProcessing 标志防止重复发送

## 具体代码

```ts
import axios from 'axios';

interface TrackEvent {
  eventName: string;
  properties: Record<string, any>;
  timestamp: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private eventQueue: TrackEvent[] = [];
  private readonly batchSize: number = 10;
  private readonly flushInterval: number = 5000; // 5 seconds
  private flushTimer: number | null = null;
  private isProcessing: boolean = false;

  private constructor() {
    this.setupBeforeUnload();
    this.startFlushTimer();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', (event) => {
      // 确保在页面关闭前发送所有积压的事件
      if (this.eventQueue.length > 0) {
        const blob = new Blob(
          [JSON.stringify({ events: this.eventQueue })],
          { type: 'application/json' }
        );
        // 使用 sendBeacon 发送数据，这个 API 专门用于在页面卸载时发送数据
        navigator.sendBeacon('/api/analytics/events', blob);
        this.eventQueue = [];
      }
    });
  }

  private startFlushTimer(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  public track(eventName: string, properties: Record<string, any> = {}): void {
    const event: TrackEvent = {
      eventName,
      properties,
      timestamp: Date.now()
    };
    
    this.eventQueue.push(event);

    // 当队列中的事件数量达到批量发送的阈值时，触发发送
    if (this.eventQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await axios.post('/api/analytics/events', {
        events: eventsToSend
      });
    } catch (error) {
      // 发送失败时，将事件放回队列
      this.eventQueue = [...eventsToSend, ...this.eventQueue];
      console.error('Failed to send analytics events:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  public destroy(): void {
    if (this.flushTimer) {
      window.clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

// 导出单例实例
export const analytics = AnalyticsService.getInstance(); 

```

## 这个实现有以下优点：

1. 使用 navigator.sendBeacon API，这是浏览器专门为页面卸载时发送数据设计的 API，它比 XMLHttpRequest 或 fetch 更可靠。
2. 批量处理：不是每个事件都立即发送，而是积累到一定数量或定时发送，减少服务器压力。
3. 自动重试：如果发送失败，事件会被放回队列，等待下次发送。
4. 类型安全：使用 TypeScript 编写，提供了良好的类型提示。
   你需要在后端实现对应的 /api/analytics/events 接口来接收这些事件数据。后端接口需要能够处理：
5. 普通的 POST 请求（用于正常的批量上报）
6. Beacon 请求（用于页面关闭时的上报）
   你可以根据实际需求调整以下参数：
   * batchSize：批量发送的阈值（默认10个事件）
   * flushInterval：定时发送的间隔（默认5秒）
   * 接口地址：目前是写死的 /api/analytics/events，你可以根据实际需求修改
