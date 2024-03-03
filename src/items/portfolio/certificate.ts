import Item from "@items/item";
import type { ICertificate } from "../../types/item";

class Certificate extends Item implements ICertificate {
  date: string;
  issuer: string;
  link: string;

  constructor(iCertificate: ICertificate) {
    super(iCertificate);
    this.date = iCertificate.date;
    this.issuer = iCertificate.issuer;
    this.link = iCertificate.link;
  }

  override getSubtitle(): string {
    return [this.issuer, this.date]
      .filter(info => !!info)
      .join(' | ');
  }

  override getPluralType(): string {
    return "certificates";
  }
}

export default Certificate;