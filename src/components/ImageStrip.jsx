import { indiaEvGallery } from "../data/mockData.js";

export default function ImageStrip() {
  return (
    <div className="image-strip">
      {indiaEvGallery.map((item) => (
        <div className="image-strip-item" key={item.caption}>
          <img src={item.src} alt={item.caption} loading="lazy" />
          <div className="image-strip-caption">{item.caption}</div>
        </div>
      ))}
    </div>
  );
}
