import requests
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

class DouYinFinanceAnalyzer:
    """抖音财经类视频数据分析工具"""
    
    def __init__(self):
        # 设置中文字体支持中文显示
        # plt.rcParams['font.sans-serif'] = ['SimHei']
        plt.rcParams['axes.unicode_minus'] = False
        
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Referer': 'https://www.douyin.com/'
        }
        self.data = pd.DataFrame()
    
    def fetch_data(self, keyword='财经', max_videos=100):
        """模拟获取抖音视频数据（实际应用中应替换为真实API调用或爬虫逻辑）\n        
        参数：
        keyword: 搜索关键词
        max_videos: 需要获取的视频数量
        
        返回：
        pandas.DataFrame 包含基础字段的模拟数据"""
        print(f'正在获取【{keyword}】相关视频数据（{max_videos}条）...')
        
        # 生成模拟数据（实际应从API获取）
        np.random.seed(42)  # 固定随机种子以获得可复现结果
        data = {
            'video_id': [f'vid{i:05d}' for i in range(max_videos)],
            'play_count': np.random.randint(1000, 1000000, size=max_videos),
            'like_count': np.random.randint(100, 200000, size=max_videos),
            'comment_count': np.random.randint(10, 5000, size=max_videos),
            'share_count': np.random.randint(5, 2000, size=max_videos),
            'duration': np.random.uniform(15, 300, size=max_videos).round(1),
            'publish_time': self._generate_random_dates('2024-01-01', max_videos)
        }
        
        # 添加与关键词相关的描述字段用于分类分析
        if keyword == '投资理财':
            investment_terms = ['基金', '股票', '理财', '存款', '收益']
            data['desc'] = [np.random.choice(investment_terms) + '技巧' for _ in range(max_videos)]
        
        self.data = pd.DataFrame(data)
        return self.data
    
    def _generate_random_dates(self, start_date, count):
        """生成随机日期序列\n        用于模拟视频发布时间"""
        start = pd.to_datetime(start_date)
        date_range = pd.date_range(start=start, periods=365, freq='D')
        return np.random.choice(date_range, size=count)
    
    def preprocess_data(self):
        """数据预处理：清洗异常值、转换时间格式等"""
        # 示例：过滤播放量大于0的视频
        if not self.data.empty:
            self.data = self.data[self.data['play_count'] > 0]
            # 转换发布时间为datetime格式
            self.data['publish_time'] = pd.to_datetime(self.data['publish_time'])
        return self.data
    
    def calculate_hotness(self, weights={'play':1, 'like':2, 'comment':3, 'share':4}):
        """计算热度指数：基于加权公式\nH = play*1 + like*2 + comment*3 + share*4"""
        if not self.data.empty:
            self.data['hotness'] = (
                self.data['play_count'] * weights['play'] +
                self.data['like_count'] * weights['like'] +
                self.data['comment_count'] * weights['comment'] +
                self.data['share_count'] * weights['share']
            )
        return self.data[['video_id', 'hotness']].sort_values('hotness', ascending=False)
    
    def analyze_correlation(self):
        """分析各指标相关性\n返回播放量、点赞、评论、分享之间的相关系数矩阵"""
        if not self.data.empty:
            cols = ['play_count', 'like_count', 'comment_count', 'share_count']
            return self.data[cols].corr()
        return None
    
    def time_analysis(self):
        """时间维度分析：发布时段与热度关系"""
        if not self.data.empty:
            # 提取发布时间的小时信息
            self.data['hour'] = self.data['publish_time'].dt.hour
            # 按小时分组统计平均热度
            return self.data.groupby('hour')['hotness'].mean().reset_index()
        return None
    
    def category_analysis(self, text_column='desc'):
        """财经子类目分析（需配合文本分类模型）\n示例方法：基于关键词的简单分类"""
        categories = {
            '股票': ['股市', '股票', '基金', 'A股'],
            '房地产': ['房产', '房价', '买房', '地产'],
            '宏观经济': ['GDP', '经济', '政策', '通胀'],
            '个人理财': ['理财', '存款', '贷款', '信用卡']
        }
        
        if not self.data.empty and text_column in self.data.columns:
            category_counts = {}
            for cat, keywords in categories.items():
                count = 0
                for keyword in keywords:
                    count += self.data[self.data[text_column].str.contains(keyword, na=False)].shape[0]
                category_counts[cat] = count
            
            return pd.Series(category_counts).sort_values(ascending=False)
        return None
    
    def visualize_hotness_distribution(self, top_n=20):
        """可视化热度分布 - 前top_n热门视频热力图"""
        if not self.data.empty:
            plt.figure(figsize=(12, 6))
            sns.barplot(x='hotness', y='video_id', data=self.data.head(top_n), palette="viridis")
            plt.title(f'Top {top_n} 财经视频热度分布')
            plt.xlabel('热度指数')
            plt.ylabel('视频ID')
            plt.show()
    
    def visualize_category_distribution(self, category_data=None):
        """财经内容分类可视化 - 饼图展示各分类占比\n参数：\ncategory_data: 分类统计结果Series，包含每个类别的计数"""
        if category_data is not None and not category_data.empty:
            plt.figure(figsize=(10, 8))
            explode = [0.05 if i == 0 else 0 for i in range(len(category_data))]
            plt.pie(category_data, labels=category_data.index, autopct='%1.1f%%', 
                   startangle=90, explode=explode, textprops={'fontsize': 12})
            plt.title('财经内容分类分布（基于关键词匹配）', fontsize=14)
            plt.axis('equal')  # 使饼图为正圆形
            plt.legend(title="分类类别", loc="upper right", bbox_to_anchor=(1.2, 1))
            plt.tight_layout()
            plt.show()
        else:
            print("没有有效的分类数据可供可视化")
    
    def visualize_time_trend(self):
        """发布时间时段与热度关系 - 折线图\n显示不同发布时段的平均热度值变化趋势"""
        time_data = self.time_analysis()
        if not time_data.empty:
            plt.figure(figsize=(12, 6))
            sns.lineplot(x='hour', y='hotness', data=time_data, marker='o', linewidth=2)
            plt.title('发布时间段与平均热度关系', fontsize=14)
            plt.xlabel('发布小时（0-23）', fontsize=12)
            plt.ylabel('平均热度值', fontsize=12)
            plt.xticks(range(0, 24), fontsize=10)
            plt.yticks(fontsize=10)
            plt.grid(True, linestyle='--', alpha=0.7)
            plt.tight_layout()
            plt.show()
        else:
            print("没有有效的时间数据可供可视化")
    
    def visualize_correlation(self):
        """指标相关性可视化 - 热力图\n展示播放量、点赞、评论、分享之间的相关性"""
        corr_matrix = self.analyze_correlation()
        if corr_matrix is not None and not corr_matrix.empty:
            plt.figure(figsize=(8, 6))
            mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
            sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f', linewidths=0.5,
                        mask=mask, square=True, cbar_kws={"shrink": .8})
            plt.title('视频指标相关性分析', fontsize=14)
            plt.tight_layout()
            plt.show()
        else:
            print("没有有效的相关性数据可供可视化")
    
if __name__ == '__main__':
    analyzer = DouYinFinanceAnalyzer()
    raw_data = analyzer.fetch_data(keyword='投资理财', max_videos=50)
    processed_data = analyzer.preprocess_data()
    hot_videos = analyzer.calculate_hotness()
    
    print("\nTop 10热门财经视频：")
    print(hot_videos.head(10))
    
    print("\n指标相关性分析：")
    corr_result = analyzer.analyze_correlation()
    print(corr_result.to_string() if corr_result is not None else "无相关性数据")
    
    print("\n发布时间时段分析：")
    time_result = analyzer.time_analysis()
    print(time_result.to_string(index=False) if not time_result.empty else "无时间数据")
    
    print("\n财经内容分类统计：")
    cat_result = analyzer.category_analysis()
    print(cat_result.to_string() if not cat_result.empty else "无分类数据")
    
    # 可视化展示
    analyzer.visualize_hotness_distribution()
    analyzer.visualize_category_distribution(cat_result)
    analyzer.visualize_time_trend()
    analyzer.visualize_correlation()
