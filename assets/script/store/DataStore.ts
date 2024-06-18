import { _decorator, Component, Node } from "cc";
import { BehaviorSubject, combineLatest } from "../lib/rxjs";
import {
  ConfigInfo,
  CustomerInfo,
  DailyQuestInfo,
} from "../shared/GameInterface";
import api from "../shared/API";
const { ccclass, property } = _decorator;

@ccclass("DataStore")
export class DataStore extends Component {
  customerInfo$: BehaviorSubject<CustomerInfo> =
    new BehaviorSubject<CustomerInfo>(null);
  leaderboard$: BehaviorSubject<CustomerInfo[]> = new BehaviorSubject<
    CustomerInfo[]
  >([]);
  dailyQuest$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  customerDailyQuest$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  config$: BehaviorSubject<ConfigInfo> = new BehaviorSubject<ConfigInfo>(null);

  async refreshCustomerInfo() {
    const { customerInfo } = await api.getCustomerInfo();
    this.customerInfo$.next(customerInfo);
  }

  async refreshConfigInfo() {
    const config = await api.getConfig();
    this.config$.next(config);
  }
}
