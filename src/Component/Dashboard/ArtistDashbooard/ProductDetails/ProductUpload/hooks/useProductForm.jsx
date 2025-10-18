// src/components/productUpload/hooks/useProductForm.js
import { useState, useEffect, useRef, useMemo } from "react";
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import getAPI from "../../../../../../api/getAPI"

export default function useProductForm() {
  const fileInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryData, setCategoryData] = useState({
    mainCategories: [],
    categories: [],
    subCategories: []
  });
  const [formData, setFormData] = useState({
    //----------------Basic Details---------------------------------//
    productName: '',
    description: '',
    mainCategory: null,
    category: null,
    subCategory: null,
    productType: null,
    editionNumber: '',
    targetedAudience: '',
    inspirationSource: '',

    //----------------Artwork  Details---------------------------------//
    medium: null,
    materials: [],
        dimensions: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    printResolution: '',
    year: null,
    editionType: null,
    framing: null,
        iframeLink: '',
    quantity: '',
    hsnCode: '',
    surfaceType: null,
    culturalRegion: null,
    biologicalMaterial: '',
    functionalUse: null,
    materialSource: '',
    craftTechnique: '',
    // toolUsage: [],
    handmade: null,
    isSigned: false,
    isResinCovered: false,
    condition: null,
    provenance: '',


    //----------------Image and Media ---------------------------------//
    iframeLink: '',
    //----------------Shipping and delivery---------------------------------//
    shippingCharges: '',
    estimatedDelivery: null,
    packagingType: null,
    insuranceCoverage: false,
    selfShipping: false,
    quantity: '',
    hsnCode: '',
    surfaceType: null,
    isSigned: false,
    condition: null,
    provenance: '',
    handlingTime: null,
    returnPolicy: null,
    exportRestriction: false,
    //----------------Payout and details---------------------------------//

    autoCancelOrder: false,
    giftWrapping: false,
    giftWrappingCustomMessage: '',
    giftWrappingCost: false,
    giftWrappingCostAmount: '',

    ownershipConfirmation: false,
    copyrightRights: null,
    prohibitedItems: false,
    artistSignature: false,
    signatureType: '',
    coaAvailable: false,
    certificateType: null,
    issuerName: '',
    verificationNumber: '',
    coaFile: null,
    certificateFile: null,
    certificateFormat: 'digital',

    // NFT Details
    blockchainNetwork: null,
    smartContractAddress: '',
    tokenStandard: null,
    tokenId: '',
    walletAddress: '',
    royaltyPercentage: '',
    mintingType: null,
    licenseType: null,
    ipfsStorage: false,
    unlockableContent: false,
    partOfCollection: false,
    collectionName: '',
    editionSize: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    rarityType: null,
    traits: '',

    restorationHistory: '',
    provenanceHistory: '',
    engravingMarkings: '',
    patinaWear: '',
    isHandmade: false,
    museumExhibitionHistory: '',
    customEngravingAvailable: false,
   originRegion: null,
    periodEra: null,
    antiqueCondition: null,
    conservationStatus: null,
    originalReproduction: null,
    maintenanceRequired: null,


    restorationHistory: '',
    provenanceHistory: '',
    culturalSignificance: '',
    appraisalDetails: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    engravingMarkings: '',
    patinaWear: '',
    museumExhibitionHistory: '',


    restorationDocumentation: null,
    certification: null,

    isHandmade: false,
    customEngravingAvailable: false

  });

  const [pricingData, setPricingData] = useState({
    sellingPrice: '',
    marketPrice: '',
    discount: '',
    offers: [],
    allowInstallments: false,
    installmentDuration: null,
    includeGst: false,
    gstPercentage: 0
  });

  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
        } else {
          console.error("User ID not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  const [productTypes, setProductTypes] = useState([]);

  const fetchProductTypes = async () => {
    try {
      const response = await getAPI("/api/getproducttype");
      const validTypes = response.data.filter(
        type => type.name && typeof type.name === 'string'
      );
      setProductTypes(validTypes);
      if (!validTypes.length) {
        toast.error('No valid product types found');
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
      toast.error('Failed to load product types');
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);


  const productTypeOptions = useMemo(() => {
    return productTypes.map((type) => ({
      value: type.name,
      label: type.name
    }));
  }, [productTypes]);

  const fetchCategoryData = async () => {
    try {
      const response = await getAPI('/api/sub-category', {}, true);
      const categoryItems = response.data.data;
      if (categoryItems && categoryItems.length > 0) {


        const mainCategoriesMap = new Map();
        const categoriesMap = new Map();
        const subCategoriesList = [];

        categoryItems.forEach(item => {

          if (item.mainCategoryId && !mainCategoriesMap.has(item.mainCategoryId)) {
            mainCategoriesMap.set(item.mainCategoryId, {
              value: item.mainCategoryId,
              label: item.mainCategoryName
            });
          }

          if (item.categoryId && !categoriesMap.has(item.categoryId)) {
            categoriesMap.set(item.categoryId, {
              value: item.categoryId,
              label: item.categoryName,
              mainCategoryId: item.mainCategoryId
            });
          }


          if (item.subCategoryId) {
            subCategoriesList.push({
              value: item.subCategoryId,
              label: item.subCategoryName,
              categoryId: item.categoryId
            });
          }
        });

        const newCategoryData = {
          mainCategories: Array.from(mainCategoriesMap.values()),
          categories: Array.from(categoriesMap.values()),
          subCategories: subCategoriesList
        };

        console.log("Processed category data:", newCategoryData);
        setCategoryData(newCategoryData);
      } else {
        console.warn("No category items found in response");
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      toast.error('Failed to load category data');
    }
  };


  useEffect(() => {
    fetchCategoryData();
  }, []);




  const getCategoriesByMainCategory = (mainCategoryId) => {
    if (!mainCategoryId) return [];
    return categoryData.categories.filter(
      cat => cat.mainCategoryId === mainCategoryId
    );
  };

  const getSubCategoriesByCategory = (categoryId) => {
    if (!categoryId) return [];
    return categoryData.subCategories.filter(
      subCat => subCat.categoryId === categoryId
    );
  };

  const [profileData, setProfileData] = useState({ address: {} });
  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const result = await getAPI(`/auth/userid/${userId}`, {}, true, false);
      if (result.data.user) {
        const userData = result.data.user;
        const formattedBirthdate = userData.birthdate ? new Date(userData.birthdate).toISOString().split('T')[0] : '';
        const parsedAddress = userData.address ? (typeof userData.address === 'string' ? JSON.parse(userData.address) : userData.address) : {};

        setProfileData({
          ...userData,
          birthdate: formattedBirthdate,
          address: parsedAddress,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };



  const [productMediums, setProductMediums] = useState([]);

  const fetchProductMediums = async () => {
    try {
      const response = await getAPI("/api/getproductmedium");
      const validMediums = response.data.filter(
        medium => medium.name && typeof medium.name === 'string'
      );
      setProductMediums(validMediums);
      if (!validMediums.length) {
        toast.error('No valid product mediums found');
      }
    } catch (error) {
      console.error("Error fetching product mediums:", error);
      toast.error('Failed to load product mediums');
    }
  };

  useEffect(() => {
    fetchProductMediums();
  }, []);

  const mediumOptions = useMemo(() => {
    return productMediums.map((medium) => ({
      value: medium.name,
      label: medium.name
    }));
  }, [productMediums]);

  const [productMaterials, setProductMaterials] = useState([]);

  const fetchProductMaterials = async () => {
    try {
      const response = await getAPI("/api/getproductmaterials");
      const validMaterials = response.data.filter(
        material => material.name && typeof material.name === 'string'
      );
      setProductMaterials(validMaterials);
      if (!validMaterials.length) {
        toast.error('No valid product materials found');
      }
    } catch (error) {
      console.error("Error fetching product materials:", error);
      toast.error('Failed to load product materials');
    }
  };

  useEffect(() => {
    fetchProductMaterials();
  }, []);

  const materialOptions = useMemo(() => {
    return productMaterials.map((material) => ({
      value: material.name,
      label: material.name
    }));
  }, [productMaterials]);


  const [productEditions, setProductEditions] = useState([]);

  const fetchProductEditions = async () => {
    try {
      const response = await getAPI("/api/getproducteditiontypes");
      const validEditions = response.data.filter(
        edition => edition.name && typeof edition.name === "string"
      );
      setProductEditions(validEditions);
      if (!validEditions.length) {
        toast.error("No valid product editions found");
      }
    } catch (error) {
      console.error("Error fetching product editions:", error);
      toast.error("Failed to load product editions");
    }
  };

  useEffect(() => {
    fetchProductEditions();
  }, []);

  const editionOptions = useMemo(() => {
    return productEditions.map((edition) => ({
      value: edition.name,
      label: edition.name,
    }));
  }, [productEditions]);

  const framingOptions = [
    { value: 'framed', label: 'Framed' },
    { value: 'unframed', label: 'Unframed' },
    { value: 'rolled', label: 'Rolled Canvas' }
  ];


  const [surfaceTypes, setSurfaceTypes] = useState([]);

  const fetchSurfaceTypes = async () => {
    try {
      const response = await getAPI("/api/getproductsurfacetypes");
      const validSurfaceTypes = response.data.filter(
        surface => surface.name && typeof surface.name === "string"
      );
      setSurfaceTypes(validSurfaceTypes);
      if (!validSurfaceTypes.length) {
        toast.error("No valid surface types found");
      }
    } catch (error) {
      console.error("Error fetching surface types:", error);
      toast.error("Failed to load surface types");
    }
  };

  useEffect(() => {
    fetchSurfaceTypes();
  }, []);

  const surfaceTypeOptions = useMemo(() => {
    return surfaceTypes.map((surface) => ({
      value: surface.name,
      label: surface.name,
    }));
  }, [surfaceTypes]);

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'resale', label: 'Resale' },
    { value: 'pre_owned', label: 'Pre-owned' }
  ];

  const offerOptions = [
    { value: 'festival', label: 'Festival Offer' },
    { value: 'new_customer', label: 'New Customer Discount' },
    { value: 'bulk_purchase', label: 'Bulk Purchase Discount' },
    { value: 'artist_special', label: 'Artist Special' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  const finalPrice = useMemo(() => {
    if (!pricingData.sellingPrice) return 0;
    const sellingPrice = parseFloat(pricingData.sellingPrice);
    const discount = pricingData.discount ? parseFloat(pricingData.discount) : 0;
    return sellingPrice - (sellingPrice * discount / 100);
  }, [pricingData.sellingPrice, pricingData.discount]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }

    const validFiles = files.filter(file =>
      file.type.startsWith('image/') &&
      file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error('Some files were invalid (must be images under 5MB)');
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setImages(prev => [...prev, ...newImages]);
    }

    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    if (images.length <= 3) {
      toast.error('Minimum 3 images required');
      return;
    }

    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleReplaceImage = (index) => {
    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages[index] = {
          file,
          preview: URL.createObjectURL(file)
        };
        setImages(newImages);
      } else {
        toast.error('Please select a valid image file under 5MB');
      }
      e.target.value = '';
    };
  };

  const handleMoveImage = (index, direction) => {
    const newImages = [...images];
    const newIndex = direction === 'left' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInstallmentDurationChange = (selectedOption) => {
    setPricingData(prev => ({
      ...prev,
      installmentDuration: selectedOption
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPricingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };



  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      materials: selectedOptions
    }));
  };

  const handleOffersChange = (selectedOptions) => {
    setPricingData(prev => ({
      ...prev,
      offers: selectedOptions
    }));
  };

  const handleTagKeyDown = (e) => {
    if (['Enter', ','].includes(e.key) && inputTag.trim()) {
      e.preventDefault();
      setTags(prev => [...prev, inputTag.trim()]);
      setInputTag('');
    }
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  // Shipping & Delivery
  const deliveryOptions = [
    { value: '3-5', label: '3-5 days' },
    { value: '5-7', label: '5-7 days' },
    { value: '7-10', label: '7-10 days' },
    { value: '10-14', label: '10-14 days' },
  ];

  const packagingOptions = [
    { value: 'secure_box', label: 'Secure box' },
    { value: 'wooden_crate', label: 'Wooden crate' },
    { value: 'tube', label: 'Tube' },
    { value: 'bubble_wrap', label: 'Bubble wrap' }
  ];

  return {
    formData,
    pricingData,
    tags,
    inputTag,
    images,
    fileInputRef,
    isSubmitting,
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
    handleInputChange,
    handlePricingChange,
    handleInstallmentDurationChange,
    handleSelectChange,
    handleMultiSelectChange,
    handleOffersChange,
    handleTagKeyDown,
    removeTag,
    setInputTag,
    handleImageUpload,
    handleRemoveImage,
    setIsSubmitting,
    handleMoveImage,
    handleReplaceImage,
    surfaceTypeOptions,
    conditionOptions,
    setFormData,

    categoryData,
    productTypeOptions,
    getCategoriesByMainCategory,
    getSubCategoriesByCategory,
    profileData

  };
}