import React, { useState, useEffect, useRef } from "react";
import "./style.css";

const ReferenceImages = ({ selectedImages, setSelectedImages, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef();

   const images = [
    {   
        name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F6d46cf5d-9a3a-45be-9bee-cefa90921ac1.png?alt=media&token=9ac4b73a-7649-420a-a790-6b0a5a890deb"
    },
    {   name : "lion",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F0d2d1436-8020-4a2d-8e14-27a5078f43c1.png?alt=media&token=73bda86e-4ef8-431e-8953-5a1dc1588338",
    },
    {   name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F600703dd-832c-4c22-9fd5-7af3d55a20c7.png?alt=media&token=1f6593b1-e5f6-4dab-b932-dd74cafe80de",
        
    },
    {   name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F3eb4b4b7-fba6-44d3-bd4a-ab26b335c2a4.png?alt=media&token=5992eb06-9d02-41e4-bd4b-9ffa53ce5aba",
        
    },
    {   
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F2f597f7e-731e-4ad2-8715-4552827ca388.png?alt=media&token=f4a0860c-611c-4d22-9b09-62a4ca1a96fb",
       
    },
    {    name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F9f426b3c-5649-436e-9e35-2df8fd6802e1.png?alt=media&token=5fbe1edd-9a81-47e3-9bff-1983f71cd04c",
       
    },
    {   name : "dog and cat",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F52776247-fd34-4833-ad4d-d05c2f43473c.png?alt=media&token=2fe26b75-85c9-4374-9c8a-1a406709b555",
       
    },
    {    name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F4a06a5ca-93eb-4298-8ffd-b597c65deeca.png?alt=media&token=afab8749-7f0b-492a-9fcc-860ef9cd7134",
       
    },
    {   
        name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2Fde852841-a3dc-43d6-a855-4c4cf2348d01.png?alt=media&token=9cc13f15-ac98-4862-a2b6-5f6fe195ae0b",
        
    },
    { name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F8cdfdb89-264e-4200-81c8-1cd745e728e7.png?alt=media&token=12c950e9-9a04-4c58-9440-fb3dad77b747",
        
    },
    {   name : "cat",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F0cfffee6-469a-49c9-87bf-4007a138ab39.png?alt=media&token=9b31a31c-d2eb-4166-8b4a-e47f248f47a0",
        
    },
    {   
        name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F15ea821e-6708-4f6c-a57b-11fed671109f.png?alt=media&token=41f50d93-70a5-4e65-93a8-76e2fbc95bef",
       
    },
    {   name : "cat",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F860fce1e-10c7-4c14-8992-097bc2a9f4d6.png?alt=media&token=9fe9dd96-481a-4474-8349-fbd98e5c6d48",
        
    },
    { name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F4b07537b-c5e4-413f-ad42-2a30b4baffa2.png?alt=media&token=59427834-3e37-44c9-82e1-ec29ce07b941",
        
    },
    {   
        name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F4f45cee5-5694-4a3d-a27d-03235685796c.png?alt=media&token=1547dcab-4938-4d92-8825-1bac46151092",
        
    },
    {   name : "god",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F9ecc5d91-71b3-4822-958f-a2447247aa5a.png?alt=media&token=56b0ae05-a1fe-4f36-9e8d-f94d7de6e1ec",
        
    },
    {
          name : "dog",
        url: "https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F561d7b9c-d373-49bf-9a10-db60300c468a.png?alt=media&token=9324b239-9056-4460-b385-948f6ca35db7"}
]

  const filteredImages = images.filter(img =>
    img.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (url) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter(img => img !== url));
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="popup-container">
      <div className="popup" ref={popupRef}>
        <h3>Select Reference Images</h3>

        <input
          type="text"
          className="search-bar"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {selectedImages.length > 0 && (
          <div className="selected-images">
            <h4>Selected: <span>({selectedImages.length})</span></h4>
            <button className="done-button" onClick={onClose}>
               Done
             </button>
          </div>
        )}

        <div className="grid">
          {filteredImages.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={img.name || "tattoo"}
              onClick={() => handleSelect(img.url)}
              className={selectedImages.includes(img.url) ? "selected" : ""}
            />
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default ReferenceImages;
