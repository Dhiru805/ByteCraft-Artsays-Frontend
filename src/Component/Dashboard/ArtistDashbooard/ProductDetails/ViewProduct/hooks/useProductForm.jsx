import { useState, useEffect, useRef, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import getAPI from "../../../../../../api/getAPI";

const mapDbToSelectOption = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) {
    return val.map((v) => ({ value: v, label: v }));
  }
  return { value: val, label: val };
};

export default function useProductForm(product = null) {
  const fileInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: [],
  });

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    mainCategory: null,
    category: null,
    subCategory: null,
    productType: null,
    editionNumber: "",
    targetedAudience: "",
    inspirationSource: "",
    medium: null,
    materials: [],
    width: "",
    height: "",
    depth: "",
    weight: "",
    printResolution: "",
    year: null,
    editionType: null,
    framing: null,
    quantity: "",
    hsnCode: "",
    surfaceType: null,
    culturalRegion: null,
    biologicalMaterial: "",
    functionalUse: null,
    materialSource: "",
    craftTechnique: "",
    handmade: null,
    isSigned: false,
    isResinCovered: false,
    condition: null,
    provenance: "",
    iframeLink: "",
    shippingCharges: "",
    estimatedDelivery: null,
    packagingType: null,
    insuranceCoverage: false,
    selfShipping: false,
    handlingTime: null,
    returnPolicy: null,
    exportRestriction: false,
    autoCancelOrder: false,
    giftWrapping: false,
    giftWrappingCustomMessage: "",
    giftWrappingCost: false,
    giftWrappingCostAmount: "",
    ownershipConfirmation: false,
    copyrightRights: null,
    prohibitedItems: false,
    artistSignature: false,
    signatureType: "",
    coaAvailable: false,
    certificateType: null,
    issuerName: "",
    verificationNumber: "",
    coaFile: null,
    certificateFile: null,
    certificateFormat: "digital",
    blockchainNetwork: null,
    smartContractAddress: "",
    tokenStandard: null,
    tokenId: "",
    walletAddress: "",
    royaltyPercentage: "",
    mintingType: null,
    licenseType: null,
    ipfsStorage: false,
    unlockableContent: false,
    partOfCollection: false,
    collectionName: "",
    editionSize: "",
    rarityType: null,
    traits: "",
    originRegion: null,
    periodEra: null,
    antiqueCondition: null,
    conservationStatus: null,
    originalReproduction: null,
    maintenanceRequired: null,
    restorationHistory: "",
    provenanceHistory: "",
    culturalSignificance: "",
    appraisalDetails: "",
    engravingMarkings: "",
    patinaWear: "",
    museumExhibitionHistory: "",
    restorationDocumentation: null,
    certification: null,
    isHandmade: false,
    customEngravingAvailable: false,
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [pricingData, setPricingData] = useState({
    sellingPrice: "",
    marketPrice: "",
    discount: "",
    offers: [],
    allowInstallments: false,
    installmentDuration: null,
    includeGst: false,
    gstPercentage: 0,
  });

  const [userId, setUserId] = useState("");
  const [images, setImages] = useState([]);
  const [profileData, setProfileData] = useState({ address: {} });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || "");
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);


  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const res = await getAPI(`/auth/userid/${userId}`, {}, true, false);
          const user = res.data.user;
          const address = typeof user.address === "string" ? JSON.parse(user.address) : user.address || {};
          setProfileData({ ...user, address });
        } catch (err) {
          console.error("Profile fetch error", err);
        }
      };
      fetchProfile();
    }
  }, [userId]);


  const [productTypes, setProductTypes] = useState([]);
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const res = await getAPI("/api/getproducttype");
        setProductTypes(res.data.filter((t) => t.name));
      } catch (err) {
        toast.error("Failed to load product types");
      }
    };
    fetchProductTypes();
  }, []);

  const productTypeOptions = useMemo(() => {
    return productTypes.map((t) => ({ value: t.name, label: t.name }));
  }, [productTypes]);


  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await getAPI("/api/sub-category", {}, true);
        const items = res.data.data || [];
        const mainMap = new Map();
        const catMap = new Map();
        const subList = [];

        items.forEach((i) => {
          if (i.mainCategoryId && !mainMap.has(i.mainCategoryId)) {
            mainMap.set(i.mainCategoryId, { value: i.mainCategoryId, label: i.mainCategoryName });
          }
          if (i.categoryId && !catMap.has(i.categoryId)) {
            catMap.set(i.categoryId, {
              value: i.categoryId,
              label: i.categoryName,
              mainCategoryId: i.mainCategoryId,
            });
          }
          if (i.subCategoryId) {
            subList.push({
              value: i.subCategoryId,
              label: i.subCategoryName,
              categoryId: i.categoryId,
            });
          }
        });

        setCategoryData({
          mainCategories: Array.from(mainMap.values()),
          categories: Array.from(catMap.values()),
          subCategories: subList,
        });
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategoryData();
  }, []);

  const getCategoriesByMainCategory = (id) =>
    categoryData.categories.filter((c) => c.mainCategoryId === id);
  const getSubCategoriesByCategory = (id) =>
    categoryData.subCategories.filter((s) => s.categoryId === id);


  const [mediums, setMediums] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [editions, setEditions] = useState([]);
  const [surfaceTypes, setSurfaceTypes] = useState([]);

  useEffect(() => {
    const fetch = async (url, setter) => {
      try {
        const res = await getAPI(url);
        setter(res.data.filter((i) => i.name));
      } catch (err) {
        toast.error(`Failed to load ${url}`);
      }
    };
    fetch("/api/getproductmedium", setMediums);
    fetch("/api/getproductmaterials", setMaterials);
    fetch("/api/getproducteditiontypes", setEditions);
    fetch("/api/getproductsurfacetypes", setSurfaceTypes);
  }, []);

  const mediumOptions = useMemo(() => mediums.map((m) => ({ value: m.name, label: m.name })), [mediums]);
  const materialOptions = useMemo(() => materials.map((m) => ({ value: m.name, label: m.name })), [materials]);
  const editionOptions = useMemo(() => editions.map((e) => ({ value: e.name, label: e.name })), [editions]);
  const surfaceTypeOptions = useMemo(() => surfaceTypes.map((s) => ({ value: s.name, label: s.name })), [surfaceTypes]);

  const framingOptions = [
    { value: "framed", label: "Framed" },
    { value: "unframed", label: "Unframed" },
    { value: "rolled", label: "Rolled Canvas" },
  ];

  const conditionOptions = [
    { value: "new", label: "New" },
    { value: "resale", label: "Resale" },
    { value: "pre_owned", label: "Pre-owned" },
  ];

  const offerOptions = [
    { value: "festival", label: "Festival Offer" },
    { value: "new_customer", label: "New Customer Discount" },
    { value: "bulk_purchase", label: "Bulk Purchase Discount" },
    { value: "artist_special", label: "Artist Special" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));

  const deliveryOptions = [
    { value: "3-5", label: "3-5 days" },
    { value: "5-7", label: "5-7 days" },
    { value: "7-10", label: "7-10 days" },
    { value: "10-14", label: "10-14 days" },
  ];

  const packagingOptions = [
    { value: "secure_box", label: "Secure box" },
    { value: "wooden_crate", label: "Wooden crate" },
    { value: "tube", label: "Tube" },
    { value: "bubble_wrap", label: "Bubble wrap" },
  ];

  const finalPrice = useMemo(() => {
    if (!pricingData.sellingPrice) return 0;
    const sp = parseFloat(pricingData.sellingPrice);
    const disc = pricingData.discount ? parseFloat(pricingData.discount) : 0;
    return sp - (sp * disc) / 100;
  }, [pricingData.sellingPrice, pricingData.discount]);


  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   if (files.length + images.length > 8) {
  //     toast.error("Maximum 8 images allowed");
  //     return;
  //   }
  //   const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
  //   if (valid.length < files.length) toast.error("Invalid files (max 5MB, image only)");
  //   const newImgs = valid.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
  //   setImages((prev) => [...prev, ...newImgs]);
  //   e.target.value = "";
  // };

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);


  if (images.length + files.length > 8) {
    toast.error(`You can upload up to 8 images total`);
    e.target.value = "";
    return;
  }


  const valid = files.filter(
    (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
  );
  if (valid.length < files.length)
    toast.error("Some files are invalid (only images under 5MB allowed)");


  const newImgs = valid.map((f) => ({
    file: f,
    preview: URL.createObjectURL(f),
    isExisting: false,
    
  }));


  setImages((prev) => [...prev, ...newImgs]);


  e.target.value = "";
};


  const handleRemoveImage = (idx) => {
    if (images.length <= 3) {
      toast.error("Minimum 3 images required");
      return;
    }
    const img = images[idx];
    if (img.preview && !img.file) URL.revokeObjectURL(img.preview);
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReplaceImage = (idx) => {
    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        const newImgs = [...images];
        if (newImgs[idx].preview && !newImgs[idx].file) URL.revokeObjectURL(newImgs[idx].preview);
        newImgs[idx] = { file, preview: URL.createObjectURL(file) };
        setImages(newImgs);
      } else {
        toast.error("Invalid image");
      }
      e.target.value = "";
    };
  };

  const handleMoveImage = (idx, dir) => {
    const newIdx = dir === "left" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const newImgs = [...images];
    [newImgs[idx], newImgs[newIdx]] = [newImgs[newIdx], newImgs[idx]];
    setImages(newImgs);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePricingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPricingData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleInstallmentDurationChange = (opt) => {
    setPricingData((prev) => ({ ...prev, installmentDuration: opt }));
  };

  const handleSelectChange = (name, opt) => {
    setFormData((prev) => ({ ...prev, [name]: opt }));
  };

  const handleMultiSelectChange = (opts) => {
    setFormData((prev) => ({ ...prev, materials: opts }));
  };

   const handleMultiSelecttoolChange = (field, selectedOptions) => {
   setFormData(prev => ({
     ...prev,
     [field]: selectedOptions || []   
   }));
 };

  const handleOffersChange = (opts) => {
    setPricingData((prev) => ({ ...prev, offers: opts }));
  };

  const handleTagKeyDown = (e) => {
    if (["Enter", ","].includes(e.key) && inputTag.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, inputTag.trim()]);
      setInputTag("");
    }
  };

  const removeTag = (idx) => setTags((prev) => prev.filter((_, i) => i !== idx));


  useEffect(() => {
    if (!product || !categoryData.mainCategories.length) return;

    const p = product;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';


    setFormData((prev) => ({
      ...prev,
      productName: p.productName || "",
      description: p.description || "",
      mainCategory: categoryData.mainCategories.find(m => m.value === p.mainCategory) || null,
      category: categoryData.categories.find(c => c.value === p.category) || null,
      subCategory: (() => {
        if (!p.subCategory) return null;
        const found = categoryData.subCategories.find(s => s.value === p.subCategory);
        return found || { value: p.subCategory, label: p.subCategory };
      })(),
      productType: mapDbToSelectOption(p.productType?.[0] || p.productType) || null,
      editionNumber: p.editionNumber?.toString() || "",
      targetedAudience: p.targetedAudience || "",
      inspirationSource: p.inspirationSource || "",
      medium: mapDbToSelectOption(p.medium) || null,
      materials: mapDbToSelectOption(p.materials) || [],
      toolUsage: mapDbToSelectOption(p.toolUsage) || [],
      width: p.dimensions?.width?.toString() || "",
      height: p.dimensions?.height?.toString() || "",
      depth: p.dimensions?.depth?.toString() || "",
      weight: p.weight?.toString() || "",
      printResolution: p.printResolution || "",
      year: mapDbToSelectOption(p.year) || null,
      editionType: mapDbToSelectOption(p.editionType) || null,
      framing: mapDbToSelectOption(p.framing) || null,
      quantity: p.quantity?.toString() || "1",
      hsnCode: p.hsnCode || "",
      surfaceType: mapDbToSelectOption(p.surfaceType) || null,
      culturalRegion: mapDbToSelectOption(p.culturalRegion) || null,
      biologicalMaterial: p.biologicalMaterial || "",
      functionalUse: mapDbToSelectOption(p.functionalUse) || null,
      materialSource: p.materialSource || "",
      craftTechnique: p.craftTechnique || "",
      handmade: mapDbToSelectOption(p.handmade) || null,
      isSigned: !!p.isSigned,
      isResinCovered: !!p.isResinCovered,
      condition: mapDbToSelectOption(p.condition) || null,
      provenance: p.provenance || "",
      iframeLink: p.iframeLink || "",
      shippingCharges: p.shippingCharges?.toString() || "",
      estimatedDelivery: mapDbToSelectOption(p.estimatedDelivery) || null,
      packagingType: mapDbToSelectOption(p.packagingType) || null,
      insuranceCoverage: !!p.insuranceCoverage,
      selfShipping: !!p.selfShipping,
      handlingTime: mapDbToSelectOption(p.handlingTime) || null,
      returnPolicy: mapDbToSelectOption(p.returnPolicy) || null,
      exportRestriction: !!p.exportRestriction,
      autoCancelOrder: !!p.autoCancelOrder,
      giftWrapping: !!p.giftWrapping,
      giftWrappingCustomMessage: p.giftWrappingCustomMessage || "",
      giftWrappingCost: !!p.giftWrappingCost,
      giftWrappingCostAmount: p.giftWrappingCostAmount?.toString() || "",
      ownershipConfirmation: !!p.ownershipConfirmation,
      certificateType: mapDbToSelectOption(p.certificateType) || null,
      certificateFile: p.certificateFile || null,
      certification:p.certification|| null,
      restorationDocumentation:p.restorationDocumentation|| null,
      coaFile: p.coaFile || null,
      coaPreview: null,
      issuerName: p.issuerName || "",
      verificationNumber: p.verificationNumber || "",
      commercialUse: mapDbToSelectOption(p.commercialUse) || null,
      royaltyTerms: p.royaltyTerms || "",
      ethicalSourcing: !!p.ethicalSourcing,
      copyrightRights: mapDbToSelectOption(p.copyrightRights) || null,
      prohibitedItems: !!p.prohibitedItems,
      artistSignature: !!p.artistSignature,
      signatureType: p.signatureType || "",
      coaAvailable: !!p.coaAvailable,
      certificateFormat: p.certificateFormat || "digital",
      blockchainNetwork: mapDbToSelectOption(p.blockchainNetwork) || null,
      smartContractAddress: p.smartContractAddress || "",
      tokenStandard: mapDbToSelectOption(p.tokenStandard) || null,
      tokenId: p.tokenId || "",
      walletAddress: p.walletAddress || "",
      royaltyPercentage: p.royaltyPercentage?.toString() || "",
      mintingType: mapDbToSelectOption(p.mintingType) || null,
      licenseType: mapDbToSelectOption(p.licenseType) || null,
      ipfsStorage: !!p.ipfsStorage,
      ipfsLink: p.ipfsLink || "",
      softwareVersion: p.softwareVersion || "",
      fileFormat: p.fileFormat || "",
      unlockableContent: !!p.unlockableContent,
      unlockableContentLink: p.unlockableContentLink || "",
      partOfCollection: !!p.partOfCollection,
      collectionName: p.collectionName || "",
      editionSize: p.editionSize?.toString() || "",
      rarityType: mapDbToSelectOption(p.rarityType) || null,
      traits: p.traits || "",
      originRegion: mapDbToSelectOption(p.originRegion) || null,
      periodEra: mapDbToSelectOption(p.periodEra) || null,
      antiqueCondition: mapDbToSelectOption(p.antiqueCondition) || null,
      conservationStatus: mapDbToSelectOption(p.conservationStatus) || null,
      originalReproduction: mapDbToSelectOption(p.originalReproduction) || null,
      maintenanceRequired: mapDbToSelectOption(p.maintenanceRequired) || null,
      restorationHistory: p.restorationHistory || "",
      provenanceHistory: p.provenanceHistory || "",
      culturalSignificance: p.culturalSignificance || "",
      appraisalDetails: p.appraisalDetails || "",
      engravingMarkings: p.engravingMarkings || "",
      patinaWear: p.patinaWear || "",
      museumExhibitionHistory: p.museumExhibitionHistory || "",
      isHandmade: !!p.isHandmade,
      customEngravingAvailable: !!p.customEngravingAvailable,
      addressLine1: p.addressLine1 || profileData.address?.line1 || "",
      addressLine2: p.addressLine2 || profileData.address?.line2 || "",
      landmark: p.landmark || profileData.address?.landmark || "",
      city: p.city || profileData.address?.city || "",
      state: p.state || profileData.address?.state || "",
      country: p.country || profileData.address?.country || "",
      pincode: p.pincode || profileData.address?.pincode || "",
    }));

    setTags(p.tags || []);


    const existingImages = [];


    // if (p.mainImage) {
    //   const mainImageUrl = `${API_URL}${p.mainImage.startsWith('/') ? '' : '/'}${p.mainImage}`.replace(
    //     /([^:]\/)\/+/g,
    //     '$1'
    //   );
    //   existingImages.push({
    //     file: null,
    //     preview: mainImageUrl,
    //     isExisting: true,
    //   });
    // }


    // if (p.otherImages?.length) {
    //   p.otherImages.forEach((url) => {
    //     const fullUrl = `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`.replace(
    //       /([^:]\/)\/+/g,
    //       '$1'
    //     );
    //     existingImages.push({
    //       file: null,
    //       preview: fullUrl,
    //       isExisting: true,
    //     });
    //   });
    // }

    if (p.mainImage) {
    const mainImageUrl = `${API_URL}${p.mainImage.startsWith("/") ? "" : "/"}${p.mainImage}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
    existingImages.push({
      file: null,
      preview: mainImageUrl,
      isExisting: true,
      isMain: true, 
    });
  }

  
if (p.otherImages?.length) {
  const seen = new Set(); 

  p.otherImages.forEach((url) => {
    if (!url) return;

    let cleanUrl = url.replace(/^http:\/\/localhost:3001\/http:\/\/localhost:3001\//, "/");

   
    cleanUrl = cleanUrl.replace(/^http:\/\/localhost:3001\//, "/");


    cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, "$1");

    const fullUrl = `${API_URL}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;


    if (seen.has(fullUrl)) return;
    seen.add(fullUrl);

    existingImages.push({
      file: null,
      preview: fullUrl,
      isExisting: true,
      isMain: false,
    });
  });
}

  setImages(existingImages);

    setImages(existingImages);


    setPricingData({
      sellingPrice: p.sellingPrice?.toString() || "",
      marketPrice: p.marketPrice?.toString() || "",
      discount: p.discount?.toString() || "",
      allowInstallments: !!p.allowInstallments,
      installmentDuration: mapDbToSelectOption(p.installmentDuration) || null,
      includeGst: !!p.includeGst,
      gstPercentage: p.gstPercentage?.toString() || "0",
    });
  }, [product, categoryData, profileData]);

  return {
    formData,
    setFormData,
    pricingData,
    setPricingData,
    tags,
    setTags,
    inputTag,
    setInputTag,
    images,
    setImages,
    fileInputRef,
    isSubmitting,
    setIsSubmitting,
    userId,
    finalPrice,
    mediumOptions,
    materialOptions,
    editionOptions,
    framingOptions,
    offerOptions,
    yearOptions,
    deliveryOptions,
    packagingOptions,
    surfaceTypeOptions,
    conditionOptions,
    categoryData,
    productTypeOptions,
    getCategoriesByMainCategory,
    getSubCategoriesByCategory,
    profileData,
    handleInputChange,
    handlePricingChange,
    handleInstallmentDurationChange,
    handleSelectChange,
    handleMultiSelectChange,
    handleMultiSelecttoolChange,
    handleOffersChange,
    handleTagKeyDown,
    removeTag,
    setInputTag,
    handleImageUpload,
    handleRemoveImage,
    handleReplaceImage,
    handleMoveImage,
  };
}