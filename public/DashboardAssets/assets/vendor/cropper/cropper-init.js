$(function () {
  "use strict";

  var console = window.console || { log: function () {} };

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

  // Download
  // if (typeof $download[0].download === 'undefined') {
  //   $download.addClass('disabled');
  // }

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

            //save Button
            $("#saveImageBtn")
              .off("click")
              .on("click", function () {
                var imageData = result.toDataURL("image/jpeg");

                // Show success toast
                Toastify({
                  text: "Image has been saved!",
                  backgroundColor: "green",
                  duration: 3000,
                }).showToast();

                // Find the preview container
                var previewContainer = document.querySelector(
                  ".image-preview-container"
                );

                // Create a new div to hold image and edit button
                var imageWrapper = document.createElement("div");
                imageWrapper.style.position = "relative"; // Position relative to allow absolute positioning of the button
                imageWrapper.style.display = "inline-block"; // So it doesn’t take up full width of the parent container
                imageWrapper.style.marginBottom = "10px";

                // Create a new image element
                var newImage = document.createElement("img");
                newImage.src = imageData;
                newImage.style.width = "100px";
                newImage.style.height = "100px";
                newImage.style.borderRadius = "5px";
                newImage.style.objectFit = "cover"; // Ensures the cropped image looks similar
                newImage.alt = "Cropped Image Preview";

                // Create an edit button
                var editButton = document.createElement("button");
                editButton.innerHTML = `<i class="fa fa-edit"></i>`; // Use Font Awesome for the edit icon
                editButton.style.position = "absolute";
                editButton.style.top = "5px";
                editButton.style.right = "5px";
                editButton.style.background = "rgba(0, 0, 0, 0.5)";
                editButton.style.color = "#fff";
                editButton.style.border = "none";
                editButton.style.padding = "5px";
                editButton.style.borderRadius = "50%";
                editButton.style.cursor = "pointer";

                // Store image data as an attribute on the button
                editButton.setAttribute("data-image", imageData);

                // Append the new image and button to the wrapper
                imageWrapper.appendChild(newImage);
                imageWrapper.appendChild(editButton);

                // Append the wrapper to the preview container
                previewContainer.appendChild(imageWrapper);

                // Add event listener to edit button
                // editButton.addEventListener('click', function () {
                //     var imgSrc = this.getAttribute('data-image'); // Get the stored image data

                //     // Hide the image wrapper (which contains the image and the edit button)
                //     imageWrapper.style.display = "none";

                //     // Destroy the existing cropper instance if it exists
                //     if ($image.data('cropper')) {
                //         $image.cropper('destroy'); // Destroy any existing cropper instance
                //     }

                //     // Set the new image source for cropper
                //     $image.attr('src', imgSrc);

                //     // Reinitialize the cropper with the new image
                //     $image.cropper({
                //         aspectRatio: 16 / 9,
                //         preview: '.img-preview'
                //     });
                // });

                $(document).on(
                  "click",
                  ".image-preview-container button",
                  function () {
                    var parentWrapper = $(this).parent(); // Get the parent wrapper

                    // Hide both the image and the edit button
                    parentWrapper.find("img, button").hide();

                    // Continue with the cropper functionality
                    var imgSrc = $(this).data("image");
                    $image.cropper("destroy");
                    $image.attr("src", imgSrc);
                    $image.cropper({
                      aspectRatio: 16 / 9,
                      preview: ".img-preview",
                    });
                  }
                );

                // Update the image in the cropper box
                $image.cropper("replace", imageData);
              });

            //   $('#saveImageBtn').on('click', function() {
            //     var imageData = result.toDataURL('image/jpeg');

            //     // Get the current count of saved images, or set to 0 if none exist
            //     var imageCount = localStorage.getItem('imageCount');
            //     imageCount = imageCount ? parseInt(imageCount) : 0;

            //     // Increment the count
            //     imageCount++;

            //     // Save the image in localStorage with a dynamic key
            //     localStorage.setItem('croppedImage' + imageCount, imageData);

            //     // Update the count in localStorage
            //     localStorage.setItem('imageCount', imageCount);

            //     alert('Image has been saved! Image number: ' + imageCount);
            // })

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
    // $inputImage.change(function () {
    //   var files = this.files;
    //   var file;
    //   if (files && files.length) {
    //       file = files[0];
    //       if (/^image\/\w+$/.test(file.type)) {
    //           var reader = new FileReader();
    //           reader.onload = function (e) {
    //               // Show the selected image before cropping
    //               $selectedImagePreview.attr('src', e.target.result).css('display', 'block');
    //               // Set the image for cropping
    //               $image.cropper('destroy').attr('src', e.target.result).cropper({
    //                   aspectRatio: 16 / 9,
    //                   preview: '.img-preview'
    //               });
    //           };
    //           reader.readAsDataURL(file);
    //       } else {
    //           alert('Please choose a valid image file.');
    //       }
    //   }
    // });
  } else {
    $inputImage.prop("disabled", true).parent().addClass("disabled");
  }

  $(document).ready(function () {
    var $image = $("#image");
    var processedFiles = []; // Track processed files by data URL

    // Initialize Cropper
    // $image.cropper({
    //     aspectRatio: 16 / 9,
    //     preview: ".img-preview"
    // });

    // Handle file input change
    $("#inputImage").change(function () {
      var files = this.files;
      var totalFiles = files.length;

      console.log("Total files selected:", totalFiles);

      // Validate file count (Minimum 3, Maximum 10)
      if (totalFiles < 3) {
        alert("Please select at least 3 images.");
        $(this).val(""); // Reset file input
        $("#imagePreviewList").empty(); // Clear the preview list
        return;
      } else if (totalFiles > 10) {
        alert("You can select a maximum of 10 images.");
        $(this).val(""); // Reset file input
        $("#imagePreviewList").empty(); // Clear the preview list
        return;
      }

      // Clear previous images in the preview list
      $("#imagePreviewList").empty();

      // Loop through files and append previews
      $.each(files, function (index, file) {
        console.log("Processing file:", file.name);

        // Check if the file is a valid image
        if (file.type.startsWith("image/")) {
          var reader = new FileReader();

          reader.onload = function (e) {
            var imgSrc = e.target.result;
            console.log("Image preview source:", imgSrc);

            // Check if this image's base64 string is already in the processed list
            if (processedFiles.includes(imgSrc)) {
              console.log("Duplicate image detected.");
              return; // Skip adding this image
            }

            // Create Image Wrapper
            var imageWrapper = $('<div class="image-wrapper"></div>').css({
              position: "relative",
              display: "inline-block",
              margin: "5px",
            });

            // Create Image Element
            var newImage = $("<img>").attr("src", imgSrc).css({
              width: "100px",
              height: "100px",
              borderRadius: "5px",
              objectFit: "cover",
            });

            // Create Edit Button
            var editButton = $("<button>Edit</button>").css({
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              border: "none",
              padding: "5px",
              borderRadius: "50%",
              cursor: "pointer",
            });

            // Store image data in button
            editButton.attr("data-image", imgSrc);

            // Append elements
            imageWrapper.append(newImage).append(editButton);
            $("#imagePreviewList").append(imageWrapper);

            // Mark the file as processed by its data URL (base64 string)
            processedFiles.push(imgSrc);
          };

          reader.readAsDataURL(file); // This triggers the reader.onload
        } else {
          alert("Please select a valid image file.");
        }
      });
    });

    // Handle edit button click (Event Delegation)
    $(document).on("click", ".image-wrapper button", function () {
      var imgSrc = $(this).attr("data-image");

      // Destroy existing cropper and reset the image
      $image.cropper("destroy").attr("src", imgSrc);

      // Reinitialize cropper with the new image
      $image.cropper({
        aspectRatio: 16 / 9,
        preview: ".img-preview",
      });
    });
  });
});
