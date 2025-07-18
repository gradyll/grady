# 抖音财经热度分析项目说明

## 项目简介
本项目是一个基于Python的抖音财经类视频数据分析工具，包含数据采集、处理、分析和可视化功能。主要分析财经类视频的热度值及其相关指标。

## 功能模块
1. **数据采集**：模拟获取抖音视频数据（实际应用中需替换为真实API或爬虫逻辑）
2. **数据预处理**：清洗异常值、转换时间格式等
3. **热度计算**：基于加权公式计算热度指数
4. **数据分析**：
   - 指标相关性分析
   - 时间维度分析（发布时间与热度关系）
   - 内容分类统计
5. **数据可视化**：
   - 热度分布条形图
   - 内容分类饼图
   - 发布时段折线图
   - 指标相关性热力图

## 使用方法
1. 安装依赖库：
```bash
pip install pandas matplotlib seaborn numpy
```

2. 运行分析程序：
```bash
python douyin_finance_analysis.py
```

## 注意事项
1. 实际部署时需要实现真实的抖音API数据获取方式
2. 财经内容分类基于简单关键词匹配，实际应用建议使用更复杂的NLP模型
3. 热度计算公式可根据实际需求调整权重参数
4. 可视化图表样式可以根据具体需求进行定制
5. 分析结果仅供参考，实际业务决策需要结合更多因素