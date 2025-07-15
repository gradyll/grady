# import asyncio

# async def hello_world():
#     print("Hello")
#     await asyncio.sleep(4) 
#     print("World!")
    
    
# asyncio.run(hello_world())

# 定义协程
# async def fetch_data():
#     print('开始获取数据')
#     await asyncio.sleep(2)
#     print('数据获取完毕')
#     return {"data": 42}

# asyncio.run(fetch_data())


# 并发执行
# async def task(name, delay):
#     print(f"{name}开始执行")
#     await asyncio.sleep(delay)
#     print(f"{name}执行完毕")
#     return name

# async def main():
#     # 顺序执行 - 总耗时4秒
#    await task("任务1", 2)
#    await task("任务2", 2)
   
#    # 并发执行 - 总耗时2秒
#    task1 = asyncio.create_task(task("任务3", 2))
#    task2 = asyncio.create_task(task("任务4", 2))
#    await task1
#    await task2
   
#    # 更优雅的并发方式
#    results = await asyncio.gather(
#        task("任务5", 1),
#        task("任务6", 2),
#        task("任务7", 3)
#    )
   
#    print(f"所有任务完成: {results}")
   
# asyncio.run(main())

# 异步上下文管理器


# 异步爬虫：速度飞起的网络蜘蛛
import asyncio
import aiohttp
from bs4 import BeautifulSoup

async def fetch_url(session, url):
    try:
        async with session.get(url) as response:
            if response.status == 200:
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                title = soup.title.string if soup.title else "无标题"
                return f"{url}: {title}"
            return f"{url}: 状态码 {response.status}"
    except Exception as e:
        return f"{url}: 错误 {e}"
        
        
        
async def main():
    urls = [
        "https://juejin.cn",
    ]
    print("开始爬取...")
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        
        print('爬取的结果：')
        for result in results:
            print(f"   -   {result}")
            

asyncio.run(main())
        