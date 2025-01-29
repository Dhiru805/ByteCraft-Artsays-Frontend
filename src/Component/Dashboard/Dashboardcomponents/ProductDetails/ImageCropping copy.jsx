import React, { useState } from "react";
import Cropper from 'cropperjs';
/* global $ */

// const loadStyle = (href) => {
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.href = href;
//   document.head.appendChild(link);
// };

// Utility function to dynamically load scripts
// const loadScript = (src) => {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = src;
//     script.async = true;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.body.appendChild(script);
//   });
// };

function ImageCropping({ onCroppedImage }) {
//   const [loading, setLoading] = useState(true);
  const [cropper, setCropper] = useState(null);
  const [image, setImage] = useState(null);

//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 2000);

//     loadScript("https://code.jquery.com/jquery-3.6.0.min.js")
//       .then(() => {
//         return loadScript(
//           "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
//         );
//       })
//       .then(() => {
//         loadStyle("/DashboardAssets/assets/vendor/cropper/cropper.min.css");
//         return loadScript("/DashboardAssets/assets/vendor/cropper/cropper.min.js");
//       })
//       .then(() => {
//         const img = document.getElementById("image");
//         const cropperInstance = new Cropper(img, {
//           aspectRatio: 16 / 9,
//           viewMode: 1,
//         });
//         setCropper(cropperInstance);
//       })
//       .catch((err) => console.error("Failed to load script:", err));
//   }, []);

  const handleCrop = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 160,
        height: 90,
      });
      const dataURL = canvas.toDataURL("image/png");
      onCroppedImage(dataURL); // Make sure this function is called
      $('#getCroppedCanvasModal').modal("show");
      document.getElementById('download').href = dataURL; // Update the href attribute
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        if (cropper) {
          cropper.destroy();
        }
        const img = document.getElementById("image");
        img.src = reader.result;
        const cropperInstance = new Cropper(img, {
          aspectRatio: 16 / 9,
          viewMode: 1,
        });
        setCropper(cropperInstance);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="body m-b-10">
                <div className="row clearfix">
                  <div className="col-lg-8 col-md-12">
                    <div className="img-container">
                      <img
                        id="image"
                        src={image || "DashboardAssets/assets/images/auth_bg.jpg"}
                        className="img-responsive"
                        alt="Picture"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="docs-preview clearfix">
                      <div className="img-preview preview-lg"></div>
                      <div className="img-preview preview-md"></div>
                      <div className="img-preview preview-sm"></div>
                      <div className="img-preview preview-xs"></div>
                    </div>
                    <div className="docs-data">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text" htmlFor="dataX">
                            X
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataX"
                          placeholder="x"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">px</span>
                        </div>
                      </div>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Y</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataY"
                          placeholder="y"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">px</span>
                        </div>
                      </div>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Width</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataWidth"
                          placeholder="width"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">px</span>
                        </div>
                      </div>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Height</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataHeight"
                          placeholder="height"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">px</span>
                        </div>
                      </div>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Rotate</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataRotate"
                          placeholder="rotate"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">deg</span>
                        </div>
                      </div>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">ScaleX</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataScaleX"
                          placeholder="scaleX"
                        />
                      </div>

                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">ScaleY</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="dataScaleY"
                          placeholder="scaleY"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="body">
                <div className="row clearfix">
                  <div className="col-lg-8 col-md-12 docs-buttons">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-info"
                        data-method="setDragMode"
                        data-option="move"
                        title="Move"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("setDragMode", "move")'
                        >
                          {" "}
                          <span className="fa fa-arrows"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-info"
                        data-method="setDragMode"
                        data-option="crop"
                        title="Crop"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("setDragMode", "crop")'
                        >
                          {" "}
                          <span className="fa fa-crop"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        data-method="zoom"
                        data-option="0.1"
                        title="Zoom In"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("zoom", 0.1)'
                        >
                          {" "}
                          <span className="fa fa-plus-circle"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        data-method="zoom"
                        data-option="-0.1"
                        title="Zoom Out"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("zoom", -0.1)'
                        >
                          {" "}
                          <span className="fa fa-minus-circle"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="move"
                        data-option="-10"
                        data-second-option="0"
                        title="Move Left"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", -10, 0)'
                        >
                          {" "}
                          <span className="fa fa-arrow-left"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="move"
                        data-option="10"
                        data-second-option="0"
                        title="Move Right"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", 10, 0)'
                        >
                          {" "}
                          <span className="fa fa-arrow-right"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="move"
                        data-option="0"
                        data-second-option="-10"
                        title="Move Up"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", 0, -10)'
                        >
                          {" "}
                          <span className="fa fa-arrow-up"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="move"
                        data-option="0"
                        data-second-option="10"
                        title="Move Down"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", 0, 10)'
                        >
                          {" "}
                          <span className="fa fa-arrow-down"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="rotate"
                        data-option="-45"
                        title="Rotate Left"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("rotate", -45)'
                        >
                          {" "}
                          <span className="fa fa-rotate-left"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="rotate"
                        data-option="45"
                        title="Rotate Right"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("rotate", 45)'
                        >
                          {" "}
                          <span className="fa fa-rotate-right"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="scaleX"
                        data-option="-1"
                        title="Flip Horizontal"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("scaleX", -1)'
                        >
                          {" "}
                          <span className="fa fa-arrows-h"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="scaleY"
                        data-option="-1"
                        title="Flip Vertical"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("scaleY", -1)'
                        >
                          {" "}
                          <span className="fa fa-arrows-v"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="crop"
                        title="Crop"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("crop")'
                        >
                          {" "}
                          <span className="fa fa-check"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="clear"
                        title="Clear"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("clear")'
                        >
                          {" "}
                          <span className="fa fa-trash-o"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="disable"
                        title="Disable"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("disable")'
                        >
                          {" "}
                          <span className="fa fa-lock"></span>{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm "
                        data-method="enable"
                        title="Enable"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("enable")'
                        >
                          {" "}
                          <span className="fa fa-unlock"></span>{" "}
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm "
                      data-method="reset"
                      title="Reset"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("reset")'
                      >
                        {" "}
                        <span className="fa fa-refresh"></span>{" "}
                      </span>
                    </button>
                    <label
                      className="btn btn-sm  btn-upload"
                      htmlFor="inputImage"
                      title="Upload image file"
                    >
                      <input
                        type="file"
                        className="sr-only"
                        id="inputImage"
                        name="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title="Import image with Blob URLs"
                      >
                        {" "}
                        <span className="fa fa-upload"></span>{" "}
                      </span>
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm  "
                      data-method="destroy"
                      title="Destroy"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("destroy")'
                      >
                        {" "}
                        <span className="fa fa-power-off"></span>{" "}
                      </span>
                    </button>

                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        data-method="getCroppedCanvas"
                        onClick={handleCrop}
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("getCroppedCanvas")'
                        >
                          {" "}
                          Get Cropped Canvas{" "}
                        </span>{" "}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        data-method="getCroppedCanvas"
                        data-option='{ "width": 160, "height": 90 }'
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("getCroppedCanvas", { width: 160, height: 90 })'
                        >
                          {" "}
                          160&times;90{" "}
                        </span>{" "}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        data-method="getCroppedCanvas"
                        data-option='{ "width": 320, "height": 180 }'
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("getCroppedCanvas", { width: 320, height: 180 })'
                        >
                          {" "}
                          320&times;180{" "}
                        </span>{" "}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn "
                      data-method="getData"
                      data-option
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("getData")'
                      >
                        {" "}
                        Get Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="setData"
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("setData", data)'
                      >
                        {" "}
                        Set Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="getContainerData"
                      data-option
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("getContainerData")'
                      >
                        {" "}
                        Get Container Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="getImageData"
                      data-option
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("getImageData")'
                      >
                        {" "}
                        Get Image Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="getCanvasData"
                      data-option
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("getCanvasData")'
                      >
                        {" "}
                        Get Canvas Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="setCanvasData"
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("setCanvasData", data)'
                      >
                        {" "}
                        Set Canvas Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="getCropBoxData"
                      data-option
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("getCropBoxData")'
                      >
                        {" "}
                        Get Crop Box Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="setCropBoxData"
                      data-target="#putData"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title='$().cropper("setCropBoxData", data)'
                      >
                        {" "}
                        Set Crop Box Data{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="moveTo"
                      data-option="0"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title="cropper.moveTo(0)"
                      >
                        {" "}
                        0,0{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="zoomTo"
                      data-option="1"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title="cropper.zoomTo(1)"
                      >
                        {" "}
                        100%{" "}
                      </span>{" "}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      data-method="rotateTo"
                      data-option="180"
                    >
                      {" "}
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title="cropper.rotateTo(180)"
                      >
                        {" "}
                        180°{" "}
                      </span>{" "}
                    </button>

                    <input
                      type="text"
                      className="form-control"
                      id="putData"
                      placeholder="Get data to here or set data with this value"
                    />
                  </div>
                  <div className="col-lg-4 col-md-12 docs-toggles">
                    {/* <!-- .btn groups --> */}
                    <div
                      className="btn-group btn-group-justified"
                      data-toggle="buttons"
                    >
                      <label className="btn  active">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio0"
                          name="aspectRatio"
                          value="1.7777777777777777"
                        />
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title="aspectRatio: 16 / 9"
                        >
                          {" "}
                          16:9{" "}
                        </span>{" "}
                      </label>
                      <label className="btn ">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio1"
                          name="aspectRatio"
                          value="1.3333333333333333"
                        />
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title="aspectRatio: 4 / 3"
                        >
                          {" "}
                          4:3{" "}
                        </span>{" "}
                      </label>
                      <label className="btn ">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio2"
                          name="aspectRatio"
                          value="1"
                        />
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title="aspectRatio: 1 / 1"
                        >
                          {" "}
                          1:1{" "}
                        </span>{" "}
                      </label>
                      <label className="btn ">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio3"
                          name="aspectRatio"
                          value="0.6666666666666666"
                        />
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title="aspectRatio: 2 / 3"
                        >
                          {" "}
                          2:3{" "}
                        </span>{" "}
                      </label>
                      <label className="btn ">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio4"
                          name="aspectRatio"
                          value="NaN"
                        />
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title="aspectRatio: NaN"
                        >
                          {" "}
                          Free{" "}
                        </span>{" "}
                      </label>
                    </div>
                    <div className="dropdown dropup docs-options">
                      <button
                        type="button"
                        className="btn btn-success btn-block dropdown-toggle"
                        id="toggleOptions"
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {" "}
                        Toggle Options <span className="caret"></span>{" "}
                      </button>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="toggleOptions"
                        role="menu"
                      >
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="responsive"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            responsive{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="restore"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            restore{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="checkCrossOrigin"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            checkCrossOrigin{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="checkOrientation"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            checkOrientation{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="modal"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            modal{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="guides"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            guides{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="center"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            center{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="highlight"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            highlight{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="background"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            background{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="autoCrop"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            autoCrop{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="movable"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            movable{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="rotatable"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            rotatable{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="scalable"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            scalable{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="zoomable"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            zoomable{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="zoomOnTouch"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            zoomOnTouch{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="zoomOnWheel"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            zoomOnWheel{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="cropBoxMovable"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            cropBoxMovable{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="cropBoxResizable"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            cropBoxResizable{" "}
                          </label>
                        </li>
                        <li role="presentation">
                          <label className="checkbox-inline">
                            <input
                              type="checkbox"
                              name="toggleDragModeOnDblclick"
                              checked={true}
                              onChange={(e) => console.log(e.target.checked)}
                            />{" "}
                            toggleDragModeOnDblclick{" "}
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Show the cropped image in modal --> */}
        <div
          className="modal docs-cropped"
          id="getCroppedCanvasModal"
          aria-hidden="true"
          aria-labelledby="getCroppedCanvasTitle"
          role="dialog"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="title" id="getCroppedCanvasModal">
                  Cropped
                </h4>
              </div>
              <div className="modal-body"></div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <a className="btn" id="download" href="" download="cropped.webp">
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageCropping;