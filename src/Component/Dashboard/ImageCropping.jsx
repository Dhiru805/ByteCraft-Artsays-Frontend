import React, { useEffect, useState } from 'react';

const loadStyle = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  
  // Utility function to dynamically load scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
function ImageCropping() {
    const [loading, setLoading] = useState(true);

    // Simulate loading effect and load scripts/styles after component mounts
    useEffect(() => {
      setTimeout(() => {
        setLoading(false); // Set loading to false after the timeout
      }, 2000); // Example delay of 2 seconds
  
       // Load CSS files
       loadStyle('/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css');
       loadStyle('/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css');
       loadStyle('/DashboardAssets/assets/vendor/cropper/cropper.min.css');
       loadStyle('/DashboardAssets/assets/css/main.css');
  
      // Dynamically load external JS files from public folder
      Promise.all([
        loadScript('/DashboardAssets/assets/bundles/libscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/bundles/vendorscripts.bundle.js'),
        loadScript('/DashboardAssets/assets/vendor/cropper/cropper.min.js'),
        loadScript('/DashboardAssets/assets/vendor/cropper/cropper-init.js'),
        // loadScript('/DashboardAssets/assets/bundles/mainscripts.bundle.js'),
      ]).then(() => {
        const email = sessionStorage.getItem('email'); // Fetch email from session storage
        if (email) {
          // toastr.success(`Welcome, ${email}!`, 'Hello!'); // Show welcome message with toastr
        }
      }).catch(err => console.error('Failed to load script:', err));
    }, []);
  return (
    <>
   
            <div>
                <div id="main-content">
                    <div className="container-fluid">
                        <div className="block-header">
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <h2>Image Cropping</h2>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-dashboard"></i></a></li>
                                        <li className="breadcrumb-item">Forms</li>
                                        <li className="breadcrumb-item active">Image Cropping</li>
                                    </ul>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="d-flex flex-row-reverse">
                                        <div className="page_action">
                                            <button type="button" className="btn btn-primary"><i className="fa fa-download"></i> Download report</button>
                                            <button type="button" className="btn btn-secondary"><i className="fa fa-send"></i> Send report</button>
                                        </div>
                                        <div className="p-2 d-flex">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row clearfix">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="header">
                                        <h2>Image Cropper</h2>
                                    </div>
                                    <div className="body m-b-10">
                                        <div className="row clearfix">
                                            <div className="col-lg-8 col-md-12">
                                                <div className="img-container"><img id="image" src="DashboardAssets/assets/images/auth_bg.jpg" className="img-responsive" alt="Picture" /></div>
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
                                                            <span className="input-group-text" for="dataX">X</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataX" placeholder="x" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">px</span>
                                                        </div>
                                                    </div>

                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">Y</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataY" placeholder="y" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">px</span>
                                                        </div>
                                                    </div>

                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">Width</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataWidth" placeholder="width" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">px</span>
                                                        </div>
                                                    </div>

                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">Height</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataHeight" placeholder="height" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">px</span>
                                                        </div>
                                                    </div>

                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">Rotate</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataRotate" placeholder="rotate" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">deg</span>
                                                        </div>
                                                    </div>

                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">ScaleX</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataScaleX" placeholder="scaleX" />
                                                    </div>

                                                    <div className="input-group">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text">ScaleY</span>
                                                        </div>
                                                        <input type="text" className="form-control" id="dataScaleY" placeholder="scaleY" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="body">
                                        <div className="row clearfix">
                                            <div className="col-lg-8 col-md-12 docs-buttons">
                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-info" data-method="setDragMode" data-option="move" title="Move"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;setDragMode&quot;, &quot;move&quot;)"> <span className="fa fa-arrows"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-info" data-method="setDragMode" data-option="crop" title="Crop"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;setDragMode&quot;, &quot;crop&quot;)"> <span className="fa fa-crop"></span> </span></button>
                                                </div>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-success" data-method="zoom" data-option="0.1" title="Zoom In"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;zoom&quot;, 0.1)"> <span className="fa fa-plus-circle"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-success" data-method="zoom" data-option="-0.1" title="Zoom Out"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;zoom&quot;, -0.1)"> <span className="fa fa-minus-circle"></span> </span></button>
                                                </div>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="move" data-option="-10" data-second-option="0" title="Move Left"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;move&quot;, -10, 0)"> <span className="fa fa-arrow-left"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="move" data-option="10" data-second-option="0" title="Move Right"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;move&quot;, 10, 0)"> <span className="fa fa-arrow-right"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="move" data-option="0" data-second-option="-10" title="Move Up"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;move&quot;, 0, -10)"> <span className="fa fa-arrow-up"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="move" data-option="0" data-second-option="10" title="Move Down"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;move&quot;, 0, 10)"> <span className="fa fa-arrow-down"></span> </span></button>
                                                </div>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="rotate" data-option="-45" title="Rotate Left"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;rotate&quot;, -45)"> <span className="fa fa-rotate-left"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="rotate" data-option="45" title="Rotate Right"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;rotate&quot;, 45)"> <span className="fa fa-rotate-right"></span> </span></button>
                                                </div>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="scaleX" data-option="-1" title="Flip Horizontal"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;scaleX&quot;, -1)"> <span className="fa fa-arrows-h"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="scaleY" data-option="-1" title="Flip Vertical"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;scaleY&quot;, -1)"> <span className="fa fa-arrows-v"></span> </span></button>
                                                </div>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="crop" title="Crop"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;crop&quot;)"> <span className="fa fa-check"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="clear" title="Clear"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;clear&quot;)"> <span className="fa fa-trash-o"></span> </span></button>
                                                </div>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="disable" title="Disable"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;disable&quot;)"> <span className="fa fa-lock"></span> </span></button>
                                                    <button type="button" className="btn btn-sm btn-secondary" data-method="enable" title="Enable"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;enable&quot;)"> <span className="fa fa-unlock"></span> </span></button>
                                                </div>

                                                <button type="button" className="btn btn-sm btn-secondary" data-method="reset" title="Reset"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;reset&quot;)"> <span className="fa fa-refresh"></span> </span></button>
                                                <label className="btn btn-sm btn-secondary btn-upload" for="inputImage" title="Upload image file">
                                                    <input type="file" className="sr-only" id="inputImage" name="file" accept="image/*" />
                                                    <span className="docs-tooltip" data-toggle="tooltip" title="Import image with Blob URLs"> <span className="fa fa-upload"></span> </span>
                                                </label>
                                                <button type="button" className="btn btn-sm  btn-secondary" data-method="destroy" title="Destroy"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;destroy&quot;)"> <span className="fa fa-power-off"></span> </span></button>

                                                <div className="btn-group">
                                                    <button type="button" className="btn btn-sm btn-danger" data-method="getCroppedCanvas"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getCroppedCanvas&quot;)"> Get Cropped Canvas </span> </button>
                                                    <button type="button" className="btn btn-sm btn-danger" data-method="getCroppedCanvas" data-option="{ &quot;width&quot;: 160, &quot;height&quot;: 90 }"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getCroppedCanvas&quot;, { width: 160, height: 90 })"> 160&times;90 </span> </button>
                                                    <button type="button" className="btn btn-sm btn-danger" data-method="getCroppedCanvas" data-option="{ &quot;width&quot;: 320, &quot;height&quot;: 180 }"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getCroppedCanvas&quot;, { width: 320, height: 180 })"> 320&times;180 </span> </button>
                                                </div>

                                                <button type="button" className="btn btn-secondary" data-method="getData" data-option data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getData&quot;)"> Get Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="setData" data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;setData&quot;, data)"> Set Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="getContainerData" data-option data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getContainerData&quot;)"> Get Container Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="getImageData" data-option data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getImageData&quot;)"> Get Image Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="getCanvasData" data-option data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getCanvasData&quot;)"> Get Canvas Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="setCanvasData" data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;setCanvasData&quot;, data)"> Set Canvas Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="getCropBoxData" data-option data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;getCropBoxData&quot;)"> Get Crop Box Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="setCropBoxData" data-target="#putData"> <span className="docs-tooltip" data-toggle="tooltip" title="$().cropper(&quot;setCropBoxData&quot;, data)"> Set Crop Box Data </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="moveTo" data-option="0"> <span className="docs-tooltip" data-toggle="tooltip" title="cropper.moveTo(0)"> 0,0 </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="zoomTo" data-option="1"> <span className="docs-tooltip" data-toggle="tooltip" title="cropper.zoomTo(1)"> 100% </span> </button>
                                                <button type="button" className="btn btn-secondary" data-method="rotateTo" data-option="180"> <span className="docs-tooltip" data-toggle="tooltip" title="cropper.rotateTo(180)"> 180° </span> </button>

                                                <input type="text" className="form-control" id="putData" placeholder="Get data to here or set data with this value" />
                                            </div>
                                            <div className="col-lg-4 col-md-12 docs-toggles">
                                                {/* <!-- .btn groups --> */}
                                                <div className="btn-group btn-group-justified" data-toggle="buttons">
                                                    <label className="btn btn-secondary active">
                                                        <input type="radio" className="sr-only" id="aspectRatio0" name="aspectRatio" value="1.7777777777777777" />
                                                        <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 16 / 9"> 16:9 </span> </label>
                                                    <label className="btn btn-secondary">
                                                        <input type="radio" className="sr-only" id="aspectRatio1" name="aspectRatio" value="1.3333333333333333" />
                                                        <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 4 / 3"> 4:3 </span> </label>
                                                    <label className="btn btn-secondary">
                                                        <input type="radio" className="sr-only" id="aspectRatio2" name="aspectRatio" value="1" />
                                                        <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 1 / 1"> 1:1 </span> </label>
                                                    <label className="btn btn-secondary">
                                                        <input type="radio" className="sr-only" id="aspectRatio3" name="aspectRatio" value="0.6666666666666666" />
                                                        <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: 2 / 3"> 2:3 </span> </label>
                                                    <label className="btn btn-secondary">
                                                        <input type="radio" className="sr-only" id="aspectRatio4" name="aspectRatio" value="NaN" />
                                                        <span className="docs-tooltip" data-toggle="tooltip" title="aspectRatio: NaN"> Free </span> </label>
                                                </div>
                                                <div className="dropdown dropup docs-options">
                                                    <button type="button" className="btn btn-success btn-block dropdown-toggle" id="toggleOptions" data-toggle="dropdown" aria-expanded="true"> Toggle Options <span className="caret"></span> </button>

                                                    <ul className="dropdown-menu" aria-labelledby="toggleOptions" role="menu">
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="responsive" checked /> responsive </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="restore" checked /> restore </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="checkCrossOrigin" checked /> checkCrossOrigin </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="checkOrientation" checked /> checkOrientation </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="modal" checked /> modal </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="guides" checked /> guides </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="center" checked /> center </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="highlight" checked /> highlight </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="background" checked /> background </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="autoCrop" checked /> autoCrop </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="movable" checked /> movable </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="rotatable" checked /> rotatable </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="scalable" checked /> scalable </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="zoomable" checked /> zoomable </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="zoomOnTouch" checked /> zoomOnTouch </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="zoomOnWheel" checked /> zoomOnWheel </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="cropBoxMovable" checked /> cropBoxMovable </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="cropBoxResizable" checked /> cropBoxResizable </label>
                                                        </li>
                                                        <li role="presentation">
                                                            <label className="checkbox-inline">
                                                                <input type="checkbox" name="toggleDragModeOnDblclick" checked /> toggleDragModeOnDblclick </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* <!-- Show the cropped image in modal --> */}
            <div className="modal docs-cropped" id="getCroppedCanvasModal" aria-hidden="true" aria-labelledby="getCroppedCanvasTitle" role="dialog" tabindex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="title" id="getCroppedCanvasModal">Cropped</h4>
                        </div>
                        <div className="modal-body"></div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                            <a className="btn btn-primary" id="download" href="javascript:void(0);" download="cropped.html">Download</a>
                        </div>
                    </div>
                </div>
            </div>
       </>
    )
}

export default ImageCropping
