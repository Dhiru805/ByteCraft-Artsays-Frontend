  import React, { useEffect } from "react";




  function ImageCropping() {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    useEffect(() => {
      const initCropper = async () => {
        try {
        
          await loadScript(
            "/DashboardAssets/assets/vendor/cropper/cropper.min.js"
          );
          await loadScript(
            "/DashboardAssets/assets/vendor/cropper/packagingcropper-init.js"
          );
        } catch (err) {
          console.error("Failed to load script:", err);
        }
      };

      initCropper();
    }, []);

    return (
      <>
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="card">
              <div className="header">
                <h2>Image Cropper</h2>
              </div>
              <div className="body m-b-10">
                <div className="row clearfix">
                  <div className="col-lg-8 col-md-12">
                    <div className="img-container">
                      <img
                        id="image"
                        src={"DashboardAssets/assets/images/auth_bg.jpg"}
                        className="img-responsive"
                        alt="Picture"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="docs-preview clearfix">
                      <div className="img-preview preview-lg" />
                      <div className="img-preview preview-md" />
                      <div className="img-preview preview-sm" />
                      <div className="img-preview preview-xs" />
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
                          <span className="fa fa-arrows" />{" "}
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
                          <span className="fa fa-crop" />{" "}
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
                          <span className="fa fa-plus-circle" />{" "}
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
                          <span className="fa fa-minus-circle" />{" "}
                        </span>
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="move"
                        data-option={-10}
                        data-second-option={0}
                        title="Move Left"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", -10, 0)'
                        >
                          {" "}
                          <span className="fa fa-arrow-left" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="move"
                        data-option={10}
                        data-second-option={0}
                        title="Move Right"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", 10, 0)'
                        >
                          {" "}
                          <span className="fa fa-arrow-right" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="move"
                        data-option={0}
                        data-second-option={-10}
                        title="Move Up"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", 0, -10)'
                        >
                          {" "}
                          <span className="fa fa-arrow-up" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="move"
                        data-option={0}
                        data-second-option={10}
                        title="Move Down"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("move", 0, 10)'
                        >
                          {" "}
                          <span className="fa fa-arrow-down" />{" "}
                        </span>
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="rotate"
                        data-option={-45}
                        title="Rotate Left"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("rotate", -45)'
                        >
                          {" "}
                          <span className="fa fa-rotate-left" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="rotate"
                        data-option={45}
                        title="Rotate Right"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("rotate", 45)'
                        >
                          {" "}
                          <span className="fa fa-rotate-right" />{" "}
                        </span>
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="scaleX"
                        data-option={-1}
                        title="Flip Horizontal"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("scaleX", -1)'
                        >
                          {" "}
                          <span className="fa fa-arrows-h" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        data-method="scaleY"
                        data-option={-1}
                        title="Flip Vertical"
                      >
                        {" "}
                        <span
                          className="docs-tooltip"
                          data-toggle="tooltip"
                          title='$().cropper("scaleY", -1)'
                        >
                          {" "}
                          <span className="fa fa-arrows-v" />{" "}
                        </span>
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
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
                          <span className="fa fa-check" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
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
                          <span className="fa fa-trash-o" />{" "}
                        </span>
                      </button>
                    </div>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
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
                          <span className="fa fa-lock" />{" "}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
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
                          <span className="fa fa-unlock" />{" "}
                        </span>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
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
                        <span className="fa fa-refresh" />{" "}
                      </span>
                    </button>
                    {/* <label
                      className="btn btn-sm btn-secondary btn-upload"
                      htmlFor="inputImage"
                      title="Upload image file"
                    >
                      <input
                        type="file"
                        className="sr-only"
                        id="inputImage"
                        name="file"
                        accept="image/*"
                        multiple
                      />
                      <span
                        className="docs-tooltip"
                        data-toggle="tooltip"
                        title=""
                        data-original-title="Import image with Blob URLs"
                        aria-describedby="tooltip497647"
                      >
                        {" "}
                        <span className="fa fa-upload" />{" "}
                      </span>
                    </label> */}


                    {/* <button
                      type="button"
                      className="btn btn-sm  btn-secondary"
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
                        <span className="fa fa-power-off" />{" "}
                      </span>
                    </button> */}

                    <div className="btn-group">
                      {/* <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        data-method="getCroppedCanvas"
                        // onClick={handleCrop}
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
                      </button> */}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-method="getData"
                      data-option=""
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
                      className="btn btn-secondary"
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
                      className="btn btn-secondary"
                      data-method="getContainerData"
                      data-option=""
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
                      className="btn btn-secondary"
                      data-method="getImageData"
                      data-option=""
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
                      className="btn btn-secondary"
                      data-method="getCanvasData"
                      data-option=""
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
                      className="btn btn-secondary"
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
                      className="btn btn-secondary"
                      data-method="getCropBoxData"
                      data-option=""
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
                      className="btn btn-secondary"
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
                      className="btn btn-secondary"
                      data-method="moveTo"
                      data-option={0}
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
                      className="btn btn-secondary"
                      data-method="zoomTo"
                      data-option={1}
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
                      className="btn btn-secondary"
                      data-method="rotateTo"
                      data-option={180}
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
                    {/* .btn groups */}
                    {/* <div
                      className="btn-group btn-group-justified"
                      data-toggle="buttons"
                    >
                      <label className="btn btn-secondary active">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio0"
                          name="aspectRatio"
                          defaultValue="1.7777777777777777"
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
                      <label className="btn btn-secondary">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio1"
                          name="aspectRatio"
                          defaultValue="1.3333333333333333"
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
                      <label className="btn btn-secondary">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio2"
                          name="aspectRatio"
                          defaultValue={1}
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
                      <label className="btn btn-secondary">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio3"
                          name="aspectRatio"
                          defaultValue="0.6666666666666666"
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
                      <label className="btn btn-secondary">
                        <input
                          type="radio"
                          className="sr-only"
                          id="aspectRatio4"
                          name="aspectRatio"
                          defaultValue="NaN"
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
                    </div> */}
                    <div className="col-lg-8 col-md-12 docs-buttons d-flex justify-content-start">
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ width: "300px" }}
                          data-method="getCroppedCanvas"
                        >
                          <span className="docs-tooltip" data-toggle="tooltip" title="Preview Image">
                            Preview Image
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show the cropped image in modal */}
        <div
          className="modal docs-cropped"
          id="getCroppedCanvasModal"
          aria-hidden="true"
          aria-labelledby="getCroppedCanvasTitle"
          role="dialog"
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="title" id="getCroppedCanvasModal">
                  Cropped
                </h4>
              </div>
              <div className="modal-body">
                {/* Your cropped image canvas should be here */}
                <canvas id="croppedCanvas"></canvas>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-primary" id="saveImageBtn">
                  Save
                </button>

                {/* <a class="btn btn-primary" id="download" href="javascript:void(0);" download="cropped.html">Download</a> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  export default ImageCropping;