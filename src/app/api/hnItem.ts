export class HnItem {
  id: number;
  deleted: boolean;
  by: string;
  time: number;
  text: string;
  dead: boolean;
  parent: number;
  poll: any;
  kids: number[];
  url: string;
  hostname?: string;
  score: number;
  title: string;
  parts: any;
  descendants: any;
}
