export class SellsGraph {
    label: string;
    comparisonPercent: number;
    additionalData: string;
    graph: any;
  
    deserialize(input){
      this.label = input.label;
      this.additionalData = `${input.score}`;
      this.comparisonPercent = input.comparisonPercent;
      this.graph = input.averageRoomRateGraph;
      return this;
    }
}

export class VisitorsGraph {
    label: string;
    comparisonPercent: number;
    additionalData: string;
    graph: any;
  
    deserialize(input){
      this.label = input.label;
      this.additionalData = input.score;
      this.comparisonPercent = input.comparisonPercent;
      this.graph = input.averageRoomRateGraph;
      return this;
    }
}

export class UsersGraph {
    label: string;
    comparisonPercent: number;
    additionalData: string;
    graph: any;
  
    deserialize(input){
      this.label = input.label;
      this.additionalData = input.score;
      this.comparisonPercent = input.comparisonPercent;
      this.graph = input.averageRoomRateGraph;
      return this;
    }
}

export class OrdersGraph {
    label: string;
    comparisonPercent: number;
    additionalData: string;
    graph: any;
  
    deserialize(input){
      this.label = input.label;
      this.additionalData = input.score;
      this.comparisonPercent = input.comparisonPercent;
      this.graph = input.averageRoomRateGraph;
      return this;
    }
}



function shortenNumber(value: number): string {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const suffixNum = Math.floor(('' + value).length / 3);
    let shortValue = parseFloat((suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toFixed(2));
    if (shortValue % 1 !== 0) {
      shortValue = parseFloat(shortValue.toFixed(2));
    }
    return shortValue + suffixes[suffixNum];
  }