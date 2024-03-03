import Item from "@items/item";
import type { IMall } from "../../types/item";
import Location from "@components/map/Location";

class Mall extends Item implements IMall {
  latitude: number;
  longitude: number;
  stores: number;
  floors: number;
  year: number;
  area: number;
  constructor(iMall: IMall) {
    super(iMall);
    this.latitude = iMall.latitude;
    this.longitude = iMall.longitude;
    this.stores = iMall.stores;
    this.floors = iMall.floors;
    this.year = iMall.year;
    this.area = iMall.area;
  }

  override isBigImage(): boolean {
    return true;
  }

  override hasMap(): boolean {
    return true;
  }

  override getPluralType(): string {
    return "malls";  
  }
  
  override getLocations(): Location[] {
    var color = "white";
    if (this.area > 500000) color = "ew-600";
    else if (this.area > 200000) color = "ew-400";
    else if (this.area > 75000) color = "ew-200";
    var label = `<b>${this.title}</b>
      ${!!this.stores ? ("<br/>Stores: " + this.stores) : ""}
      ${!!this.area ? ("<br/>Area: " + this.area) : ""}
      ${!!this.year ? ("<br/>Opening Year: " + this.year) : ""}`;
    const location = new Location({
      latitude: this.latitude,
      longitude: this.longitude,
      label: label,
      color: color,
      link: `/${this.category}/${this.type}/${this.key}`
    });
    return [ location ];
  }
}

export default Mall;