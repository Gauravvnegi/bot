import { get, set } from 'lodash';
import { FieldSchema } from './fieldSchema.model';

export interface Deserializable {
  deserialize(input: any): this;
}

export class FaqDetailDS implements Deserializable {
  faq: FaqDetail[];

  deserialize(input: any) {
    this.faq = new Array<FaqDetail>();
    Object.keys(input).forEach((key) => {
      const faq = {
        faqKey: key,
        faq: input[key]
      }
      this.faq.push(new FaqDetail().deserialize(faq));
    });
    return this;
  }
}

export class FaqDetail implements Deserializable {
  category: string;
  faq = new Array<Faq>();

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'category', get(input, ['faqKey'])),
      set({}, 'faq', get(input, ['faq'])),
    );
    return this;
  }
}

export class Faq {
  answer: string;
  question: string;
}

export interface FaqConfigI {
    button : FieldSchema;
  }