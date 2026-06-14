(function () {
  let currentPage = 1;
  let isLoading = false;
  let hasMore = true; // 模拟还有更多数据

  // 获取需要操作的 DOM 元素
  const gridContainer = document.querySelector(".video-grid");
  const sentinel = document.getElementById("load-more-sentinel");

  // 模拟异步加载数据
  function fetchMockData(page) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟最多加载到第 3 页
        if (page > 10) {
          resolve([]);
          return;
        }
        const newItems = [
          {
            title: `新一期的前端技术分享：深入理解现代布局 (第${page}页)`,
            author: "知名 UP 主",
            duration: "10:23",
            views: Math.floor(Math.random() * 100000) + 10000,
            comments: Math.floor(Math.random() * 2000) + 100,
            cover: `https://picsum.photos/id/${100 + page}/400/225`,
          },
          {
            title: `CSS Grid 完全指南：告别复杂媒体查询 (第${page}页)`,
            author: "代码艺术家",
            duration: "22:15",
            views: Math.floor(Math.random() * 100000) + 10000,
            comments: Math.floor(Math.random() * 2000) + 100,
            cover: `https://picsum.photos/id/${101 + page}/400/225`,
          },
        ];
        resolve(newItems);
      }, 800);
    });
  }

  // 创建卡片 DOM 元素
  function createCard(item) {
    const li = document.createElement("li");
    li.className = "video-card";
    li.innerHTML = `
                    <div class="card-cover">
                        <img src="${item.cover}" alt="${item.title}" loading="lazy">
                        <div class="card-meta">${item.duration}</div>
                    </div>
                    <div class="card-info">
                        <div class="video-title">${item.title}</div>
                        <div class="video-author">
                            <span class="avatar-placeholder"></span>
                            <span class="author-name">${item.author}</span>
                        </div>
                        <div class="video-stats">
                            <span>▶️ ${item.views}万播放</span>
                            <span>💬 ${item.comments}条弹幕</span>
                        </div>
                    </div>
                `;
    return li;
  }

  // 加载更多数据
  async function loadMore() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    sentinel.textContent = "加载更多视频中...";
    try {
      const newItems = await fetchMockData(currentPage);
      if (newItems.length === 0) {
        hasMore = false;
        sentinel.textContent = "✨ 已经到底啦 ✨";
        return;
      }
      const fragment = document.createDocumentFragment();
      newItems.forEach((item) => {
        fragment.appendChild(createCard(item));
      });
      gridContainer.appendChild(fragment);
      currentPage++;
    } catch (error) {
      console.error("加载失败:", error);
      sentinel.textContent = "加载失败，点击重试";
      sentinel.style.cursor = "pointer";
      sentinel.onclick = () => {
        sentinel.style.cursor = "default";
        sentinel.textContent = "加载更多视频中...";
        loadMore();
      };
    } finally {
      isLoading = false;
      if (hasMore) {
        sentinel.textContent = "—— 滑动加载更多 ——";
      } else {
        sentinel.textContent = "✨ 已经到底啦 ✨";
      }
    }
  }

  // 监听哨兵元素实现滚动触底加载
  function initInfiniteScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading && hasMore) {
            loadMore();
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" },
    );
    observer.observe(sentinel);
  }

  initInfiniteScroll();
})();
