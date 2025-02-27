export interface GenericItem<T> extends object {
  id: string;
  [key: string]: T;
}

export interface GenericLiveItem<T> extends GenericItem<T> {
  timestamp: string;
}

export interface DummyLog extends GenericLiveItem<string> {
  status_code: string;
  level: string;
  message: string;
  source: string;
}
