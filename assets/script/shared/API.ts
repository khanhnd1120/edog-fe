import { G } from "../G";

async function post(url: string, data: any): Promise<any> {
  if (!G.gameRoot || !G.backendHost) {
    return;
  }
  let searchParams = new URLSearchParams(window.location.search);
  let token = searchParams.get("token");
  try {
    let rs = await fetch(`${G.backendHost}${url}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    switch (rs.status) {
      case 200:
        let tmp = await rs.json();
        return tmp;
      case 403:
        throw new Error("forbidden");
      default:
        let err = await rs.json();
        throw err;
    }
  } catch (err) {
    throw err;
  }
}

async function getCustomerInfo() {
  return post("/get-customer-info", {});
}

async function getLeaderboards() {
  return post("/get-leaderboard", {});
}

async function getPreLeaderboards() {
  return post("/get-pre-leaderboard", {});
}

async function getCustomerQuest() {
  return post("/get-customer-quest", {});
}

async function setWalletAddress(address: string) {
  return post("/set-wallet-address", { address });
}

async function processQuest(quest_id: number) {
  return post("/process-quest", { quest_id });
}

async function claimCustomerDailyQuest(quest_id: number) {
  return post("/claim-customer-daily-quest", {
    quest_id,
  });
}

async function getConfig() {
  return post("/get-config", {});
}

async function getCustomerDailyQuest() {
  return post("/get-customer-daily-quest", {});
}

const api = {
  post,
  getConfig,
  getCustomerInfo,
  getLeaderboards,
  getPreLeaderboards,
  getCustomerQuest,
  setWalletAddress,
  processQuest,
  claimCustomerDailyQuest,
  getCustomerDailyQuest,
};

export default api;
