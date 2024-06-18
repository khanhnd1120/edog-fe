import { _decorator, Component, Node } from "cc";
import { CatchedAptNews } from "./CatchedAptNews";
import { CatchedEgonNews } from "./CatchedEgonNews";
import { NewsType } from "../shared/GameInterface";
const { ccclass, property } = _decorator;

@ccclass("NewsManager")
export class NewsManager extends Component {
  @property({ type: [Node] })
  newsNodes: Node[] = [];

  newsProcesses: any[] = [null, null, CatchedAptNews, CatchedEgonNews];
  currentNews: NewsType;

  currentDT = 0;
  indexNewsTypeShow = 0;
  start() {
    this.currentNews = NewsType.HighScore;
    this.newsNodes.forEach((n: Node, index) => {
      n.active = false;
      if (this.currentNews == index) {
        n.active = true;
      }
    });
  }
  public showNews(type: NewsType, data?: any) {
    this.currentDT = 0;
    if (this.newsNodes[this.currentNews]) {
      this.newsNodes[this.currentNews].active = false;
    }
    this.currentNews = type;
    this.newsNodes[this.currentNews].active = true;
    if (this.newsProcesses[this.currentNews]) {
      let process = this.newsNodes[this.currentNews].getComponent(
        this.newsProcesses[this.currentNews]
      ) as any;
      if (process && process.init) {
        process.init(data);
      }
    }
  }
  update(dt: number) {
    this.currentDT += dt;
    if (this.currentDT > 3) {
      this.currentDT = 0;
      let pool = [NewsType.HighScore, NewsType.EarnAPT];
      this.indexNewsTypeShow = (this.indexNewsTypeShow + 1) % pool.length;
      this.showNews(pool[this.indexNewsTypeShow]);
    }
  }
}
