import { browser } from '#imports';

export async function navigateActiveTab(url: string) {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (activeTab?.id !== undefined && activeTab.url !== url) {
    await browser.tabs.update(activeTab.id, { url });
  }
}
