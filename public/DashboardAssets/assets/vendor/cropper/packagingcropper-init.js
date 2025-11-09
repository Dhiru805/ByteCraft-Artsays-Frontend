$(function () {
  "use strict";

  var console = window.console || { log: function () { } };

  var $image = $("#image");
  var $download = $("#download");
  var $dataX = $("#dataX");
  var $dataY = $("#dataY");
  var $dataHeight = $("#dataHeight");
  var $dataWidth = $("#dataWidth");
  var $dataRotate = $("#dataRotate");
  var $dataScaleX = $("#dataScaleX");
  var $dataScaleY = $("#dataScaleY");
  var options = {
    aspectRatio: 16 / 9,
    preview: ".img-preview",
    crop: function (e) {
      $dataX.val(Math.round(e.x));
      $dataY.val(Math.round(e.y));
      $dataHeight.val(Math.round(e.height));
      $dataWidth.val(Math.round(e.width));
      $dataRotate.val(e.rotate);
      $dataScaleX.val(e.scaleX);
      $dataScaleY.val(e.scaleY);
    },
  };

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Cropper
  $image
    .on({
      "build.cropper": function (e) {
        console.log(e.type);
      },
      "built.cropper": function (e) {
        console.log(e.type);
      },
      "cropstart.cropper": function (e) {
        console.log(e.type, e.action);
      },
      "cropmove.cropper": function (e) {
        console.log(e.type, e.action);
      },
      "cropend.cropper": function (e) {
        console.log(e.type, e.action);
      },
      "crop.cropper": function (e) {
        console.log(
          e.type,
          e.x,
          e.y,
          e.width,
          e.height,
          e.rotate,
          e.scaleX,
          e.scaleY
        );
      },
      "zoom.cropper": function (e) {
        console.log(e.type, e.ratio);
      },
    })
    .cropper(options);

  // Buttons
  if (!$.isFunction(document.createElement("canvas").getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop("disabled", true);
  }

  if (
    typeof document.createElement("cropper").style.transition === "undefined"
  ) {
    $('button[data-method="rotate"]').prop("disabled", true);
    $('button[data-method="scale"]').prop("disabled", true);
  }

  // Options
  $(".docs-toggles").on("change", "input", function () {
    var $this = $(this);
    var name = $this.attr("name");
    var type = $this.prop("type");
    var cropBoxData;
    var canvasData;

    if (!$image.data("cropper")) {
      return;
    }

    if (type === "checkbox") {
      options[name] = $this.prop("checked");
      cropBoxData = $image.cropper("getCropBoxData");
      canvasData = $image.cropper("getCanvasData");

      options.built = function () {
        $image.cropper("setCropBoxData", cropBoxData);
        $image.cropper("setCanvasData", canvasData);
      };
    } else if (type === "radio") {
      options[name] = $this.val();
    }

    $image.cropper("destroy").cropper(options);
  });

  // Methods
  $(".docs-buttons").on("click", "[data-method]", function () {
    var $this = $(this);
    var data = $this.data();
    var $target;
    var result;

    if ($this.prop("disabled") || $this.hasClass("disabled")) {
      return;
    }

    if ($image.data("cropper") && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== "undefined") {
        $target = $(data.target);

        if (typeof data.option === "undefined") {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === "rotate") {
        $image.cropper("clear");
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      if (data.method === "rotate") {
        $image.cropper("crop");
      }

      switch (data.method) {
        case "scaleX":
        case "scaleY":
          $(this).data("option", -data.option);
          break;

        case "getCroppedCanvas":
          if (result) {
            // Bootstrap's Modal
            $("#getCroppedCanvasModal")
              .modal()
              .find(".modal-body")
              .html(result);

            if (!$download.hasClass("disabled")) {
              $download.attr("href", result.toDataURL("image/jpeg"));
            }
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  });

  // Keyboard
  $(document.body).on("keydown", function (e) {
    if (!$image.data("cropper") || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper("move", -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper("move", 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper("move", 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper("move", 0, 1);
        break;
    }
  });

  // Import image
  var $inputImage = $("#inputImage");
  var URL = window.URL || window.webkitURL;
  var blobURL;

  if (URL) {
  } else {
    $inputImage.prop("disabled", true).parent().addClass("disabled");
  }

  $(document).ready(function () {
    var $image = $("#image");
    var processedFiles = []; // Array to store processed image data URLs
    var mainImage = ""; // Store the main image
    var otherImages = [];

    // Handle file input change
    $("#inputImage").off('change').on('change', function () {
      var files = this.files;
      var totalFiles = files.length;

      var currentImagesCount = processedFiles.length;
      var newTotal = currentImagesCount + totalFiles;

      // Validate the number of images
      if (newTotal < 3) {
        alert("You must have at least 3 images in total.");
        $(this).val("");
        return;
      } else if (newTotal > 10) {
        alert("You can select a maximum of 10 images in total.");
        $(this).val("");
        return;
      }

      // Loop through files and append previews
      $.each(files, function (index, file) {
        if (file.type.startsWith("image/")) {
          var reader = new FileReader();

          reader.onload = function (e) {
            var imgSrc = e.target.result;

            // Check for duplicates
            if (processedFiles.includes(imgSrc)) {
              console.log("Duplicate image detected.");
              return;
            }

            // Create image wrapper and preview
            var imageWrapper = $('<div class="image-wrapper"></div>').css({
              position: "relative",
              display: "inline-block",
              margin: "5px",
            });

            var newImage = $("<img>").attr("src", imgSrc).css({
              width: "100px",
              height: "100px",
              borderRadius: "5px",
              objectFit: "cover",
            });

            var radioButton = $('<input type="radio" name="mainImage">').css({
              position: "absolute",
              bottom: "5px",
              left: "5px",
              cursor: "pointer",
            }).attr("data-image", imgSrc);

            var editButton = $("<button></button>")
              .css({
                position: "absolute",
                top: "5px",
                right: "35px",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                padding: "5px",
                borderRadius: "50%",
                cursor: "pointer",
              })
              .html('<i class="fa fa-edit"></i>')
              .attr("data-image", imgSrc); // Store the image source in the button

            var deleteButton = $("<button></button>")
              .css({
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgba(255, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                padding: "5px",
                borderRadius: "50%",
                cursor: "pointer",
              })
              .html('<i class="fa fa-trash"></i>')
              .attr("data-image", imgSrc); // Store the image source in the button

            imageWrapper.append(newImage).append(editButton).append(deleteButton).append(radioButton);
            $("#imagePreviewList").append(imageWrapper);

            // Add the image source to the processedFiles array
            processedFiles.push(imgSrc);
          };

          reader.readAsDataURL(file);
        } else {
          alert("Please select a valid image file.");
        }
      });
    });

    // Handle edit button click
    $(document).on("click", ".image-wrapper button", function () {
      if ($(this).html().includes("fa-edit")) { // Ensure it's the edit button
        var imgSrc = $(this).attr("data-image");

        // Initialize cropper on the selected image
        $image.cropper("destroy").attr("src", imgSrc);

        $image.cropper({
          preview: ".img-preview",
          crop: function (e) {
            $dataX.val(Math.round(e.x));
            $dataY.val(Math.round(e.y));
            $dataHeight.val(Math.round(e.height));
            $dataWidth.val(Math.round(e.width));
            $dataRotate.val(e.rotate);
            $dataScaleX.val(e.scaleX);
            $dataScaleY.val(e.scaleY);
            console.log("Crop data:", e);
          },
        });

        console.log("Editing Image:", imgSrc);
      }
    });

    // Handle main image selection
    $(document).on("change", 'input[name="mainImage"]', function () {
      mainImage = $(this).attr("data-image");
      console.log("Main Image Selected:", mainImage);
    });

    // Handle delete button click
    $(document).on("click", ".image-wrapper button", function () {
      if ($(this).html().includes("fa-trash")) { // Ensure it's the delete button
        var imgSrc = $(this).attr("data-image");
        var $imageWrapper = $(this).closest('.image-wrapper');

        // Remove the image from the processedFiles array
        var index = processedFiles.indexOf(imgSrc);
        if (index !== -1) {
          processedFiles.splice(index, 1);
        }

        // Remove the image wrapper from the DOM
        $imageWrapper.remove();

        // If the deleted image is currently in the cropper, clear the cropper
        if ($image.attr("src") === imgSrc) {
          $image.cropper("destroy").attr("src", "");
        }

        console.log("Deleted Image:", imgSrc);
      }
    });

    // Save Button Click Event
    $("#saveImageBtn").off('click').on("click", function () {
      var result = $image.cropper("getCroppedCanvas");

      if (result) {
        var imageData = result.toDataURL("image/jpeg");

        var $activeImageWrapper = $(".image-wrapper").has("button[data-image='" + $image.attr("src") + "']");

        if ($activeImageWrapper.length) {
          // Update the image preview in UI
          $activeImageWrapper.find('img').attr('src', imageData);
          $activeImageWrapper.find('button').attr('data-image', imageData);
          $activeImageWrapper.find('input[type="radio"]').attr('data-image', imageData);

          // Update the processedFiles array
          var originalImageSrc = $image.attr("src");
          var index = processedFiles.indexOf(originalImageSrc);
          if (index !== -1) {
            processedFiles[index] = imageData; // Replace with cropped version
          }

          // Reinitialize the cropper with the new image
          $image.cropper("destroy").attr("src", imageData).cropper({
            preview: ".img-preview",
            crop: function (e) {
              $dataX.val(Math.round(e.x));
              $dataY.val(Math.round(e.y));
              $dataHeight.val(Math.round(e.height));
              $dataWidth.val(Math.round(e.width));
              $dataRotate.val(e.rotate);
              $dataScaleX.val(e.scaleX);
              $dataScaleY.val(e.scaleY);
            },
          });

          Toastify({
            text: "Image has been saved!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
          }).showToast();

        }
      }
    });


    // Upload Button Click Event
    $("#newuploadBtn").off('click').on('click', function (e) {
      e.preventDefault();

      // Retrieve userId from localStorage
      const token = localStorage.getItem('token');
      let userId = null;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
          userId = payload.userId; // Assuming 'userId' is stored in the payload
        } catch (error) {
          console.error("Invalid token format", error);
        }
      }

      // Collect form data
      const productName = $('input[name="productName"]').val();
      const price = parseFloat($('input[name="newPrice"]').val());
      const category = $('select[name="productCategory"]').val();
      const description = $('#description').val();
      const mainImage = $("input[name='mainImage']:checked").attr("data-image");

      // Validate required fields
      if (!productName || !userId || !price || !category || !mainImage || !description) {
        alert("Please fill all required fields, select a main image, and ensure you are logged in.");
        return;
      }

      if (price < 0) {
        alert("Price cannot be negative");
        return;
      }

      // Collect other images from processedFiles instead of raw images in UI
      const otherImages = processedFiles.filter(img => img !== mainImage);

      // Prepare form data
      const formData = {
        productName,
        userId,
        price,
        category,
        description,
        mainImage, 
        otherImages 
      };

      console.log("Uploading Data:", formData);

      // Send to backend
      $.ajax({
        url: `${process.env.REACT_APP_API_URL}/api/addproduct`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
          alert("Product uploaded successfully!");
          console.log(response);
          
          $('form')[0].reset();
          $('#imagePreviewList').empty();
          $('#description').val('');
        },
        error: function (xhr, status, error) {
          alert("Error uploading product. Check console for details.");
          console.error("AJAX Error:", status, error);
          console.error(xhr.responseText);
        }
      });
    });

  });
});