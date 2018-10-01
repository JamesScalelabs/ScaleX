angular.module('SLModule.uploadCatalogue')

    .controller('UploadCatalogueController', ["$scope", "$uibModal", "$window", "slDashboardConfig", "localStorageService", "SharedService", "UploadCatalogueService",
        function ($scope, $uibModal, $window, slDashboardConfig, localStorageService, SharedService, UploadCatalogueService) {
            console.log('UploadCatalogueController');

            $scope.fileName = "No File Selected";

            $scope.disableUploadButton = true;
            $scope.disableSellerUB = true;

            var options = {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            };
            $scope.updatedAt = new Date();
            $scope.formattedDate = $scope.updatedAt.toLocaleTimeString("en-us", options);

            $scope.alerts = {
                "alert": false,
                "type": "",
                "msg": ""
            };

            $scope.closeAlert = function () {
                $scope.alerts.alert = false;
            };
            $scope.closeAddAlert = function () {
                $scope.addAlerts.alert = false;
            };
            $scope.closeUpdateAlert = function () {
                $scope.updateAlerts.alert = false;
            };
            $scope.closeDelAlert = function () {
                $scope.delAlerts.alert = false;
            };


            userData = localStorageService.get('userData');
            userName = userData.userName;
            groupName = userData.groupName;

            $scope.managerList = ["Select"];
            $scope.sellerList = ["Select"];
            $scope.selectedManager = "Select";
            $scope.selectedSeller = "Select";

            $scope.isAdmin = (groupName === "ADMIN") ? true : false;
            $scope.isManager = (groupName === "MANAGER") ? true : false;
            $scope.isSeller = (groupName === "SELLER") ? true : false;

            $scope.selectedSeller = (groupName === "SELLER") ? userName : "Select";
            $scope.selectedManager = (groupName === "MANAGER") ? userName : "Select";

            if ($scope.selectedManager === "Select" && $scope.selectedSeller === "Select") {
                $scope.alerts.alert = true;
                $scope.alerts.type = 'warning';
                $scope.alerts.msg = "Please Select Manager to display the Seller List!!";
            }


            $scope.mpList = ["Select", "amazon", "Ebay", "CDiscount", "Lazada", "11 Street", "Sears", "Etsy"];
            $scope.catList = ["Select", "autoaccessory", "baby", "beauty", "clothing", "computers", "consumerelectronics", "foodandbeverages", "furniture", "giftcards", "health", "home", "lawnandgarden", "luggage", "musicalinstruments", "office", "petsupplies", "shoes", "sports", "toys", "watches", "jewelry"]

            $scope.selectedMP = "Select";
            $scope.selectedCat = "Select";


            $scope.mpChanged = function () {
                $scope.disableSellerUB = $scope.selectedMP === "Select" ? true : false;
                console.log($scope.disableSellerUB);
                console.log("Market Place changed " + $scope.selectedMP);
            }

            $scope.catChanged = function () {
                $scope.disableSellerUB = $scope.selectedMP === "Select" ? true : false;
                console.log($scope.disableSellerUB);
                console.log("Market Place changed " + $scope.selectedCat);
            }

            $scope.managerUpload = function () {

                managerUploadReq = {
                    "user": {
                        "sellerName": $scope.selectedSeller
                    },
                    "marketPlace": $scope.selectedMP,
                    "productCategory": $scope.selectedCat,
                    "productDetails": []
                };
                var murTemp = $scope.gridApi.selection.getSelectedRows();
                mur = murTemp.map((data) => {
                    return {
                        id: data.id,
                        itemType: data.item_type,
                        itemSku: data.item_sku,
                        externalProductId: data.external_product_id,
                        externalProductIdType: data.external_product_id_type,
                        brandName: data.brand_name,
                        itemName: data.item_name,
                        manufacturer: data.manufacturer,
                        departmentName1: data.department_name1,
                        departmentName2: data.department_name2,
                        departmentName3: data.department_name3,
                        departmentName4: data.department_name4,
                        departmentName5: data.department_name5,
                        materialType1: data.material_type1,
                        materialType2: data.material_type2,
                        materialType3: data.material_type3,
                        materialType4: data.material_type4,
                        materialType5: data.material_type5,
                        metalType: data.metal_type,
                        settingType: data.setting_type,
                        gemType: data.gem_type,
                        standardPrice: data.standard_price,
                        quantity: data.quantity,
                        merchantShippingGroupName: data.merchant_shipping_group_name,
                        mainOfferImage: data.main_offer_image,
                        swatchImageUrl: data.swatch_image_url,
                        offerImage1: data.offer_image1,
                        offerImage2: data.offer_image2,
                        offerImage3: data.offer_image3,
                        offerImage4: data.offer_image4,
                        offerImage5: data.offer_image5,
                        offerImage6: data.offer_image6,
                        offerImage7: data.offer_image7,
                        offerImage8: data.offer_image8,
                        offerImage: data.offer_image,
                        feedProductType: data.feed_product_type,
                        updateDelete: data.update_delete,
                        productDescription: data.product_description,
                        bulletPoint1: data.bullet_point1,
                        bulletPoint2: data.bullet_point2,
                        bulletPoint3: data.bullet_point3,
                        bulletPoint4: data.bullet_point4,
                        bulletPoint5: data.bullet_point5,
                        targetAudienceKeywords1: data.target_audience_keywords1,
                        targetAudienceKeywords2: data.target_audience_keywords2,
                        targetAudienceKeywords3: data.target_audience_keywords3,
                        targetAudienceKeywords4: data.target_audience_keywords4,
                        targetAudienceKeywords5: data.target_audience_keywords5,
                        specificUsesKeywords1: data.specific_uses_keywords1,
                        specificUsesKeywords2: data.specific_uses_keywords2,
                        specificUsesKeywords3: data.specific_uses_keywords3,
                        specificUsesKeywords4: data.specific_uses_keywords4,
                        specificUsesKeywords5: data.specific_uses_keywords5,
                        genericKeywords1: data.generic_keywords1,
                        genericKeywords2: data.generic_keywords2,
                        genericKeywords3: data.generic_keywords3,
                        genericKeywords4: data.generic_keywords4,
                        genericKeywords5: data.generic_keywords5,
                        websiteShippingWeight: data.website_shipping_weight,
                        websiteShippingWeightUnitOfMeasure: data.website_shipping_weight_unit_of_measure,
                        displayDimensionsUnitOfMeasure: data.display_dimensions_unit_of_measure,
                        itemDisplayDiameter: data.item_display_diameter,
                        itemDisplayHeight: data.item_display_height,
                        itemDisplayWidth: data.item_display_width,
                        itemDisplayLength: data.item_display_length,
                        itemLength: data.item_length,
                        itemWidth: data.item_width,
                        itemHeight: data.item_height,
                        itemDimensionsUnitOfMeasure: data.item_dimensions_unit_of_measure,
                        itemDisplayWeight: data.item_display_weight,
                        itemDisplayWeightUnitOfMeasure: data.item_display_weight_unit_of_measure,
                        fulfillmentCenterId: data.fulfillment_center_id,
                        packageLength: data.package_length,
                        packageHeight: data.package_height,
                        packageWidth: data.package_width,
                        packageDimensionsUnitOfMeasure: data.package_dimensions_unit_of_measure,
                        packageWeight: data.package_weight,
                        packageWeightUnitOfMeasure: data.package_weight_unit_of_measure,
                        countryOfOrigin: data.country_of_origin,
                        prop65: data.prop_65,
                        cpsiaCautionaryStatement1: data.cpsia_cautionary_statement1,
                        cpsiaCautionaryStatement2: data.cpsia_cautionary_statement2,
                        cpsiaCautionaryStatement3: data.cpsia_cautionary_statement3,
                        cpsiaCautionaryStatement4: data.cpsia_cautionary_statement4,
                        cpsiaCautionaryDescription: data.cpsia_cautionary_description,
                        fabricType1: data.fabric_type1,
                        fabricType2: data.fabric_type2,
                        fabricType3: data.fabric_type3,
                        fabricType4: data.fabric_type4,
                        fabricType5: data.fabric_type5,
                        fabricType6: data.fabric_type6,
                        fabricType7: data.fabric_type7,
                        fabricType8: data.fabric_type8,
                        fabricType9: data.fabric_type9,
                        fabricType10: data.fabric_type10,
                        importDesignation: data.import_designation,
                        conditionType: data.condition_type,
                        conditionNote: data.condition_note,
                        currency: data.currency,
                        productSiteLaunchDate: data.product_site_launch_date,
                        productTaxCode: data.product_tax_code,
                        listPrice: data.list_price,
                        salePrice: data.sale_price,
                        saleFromDate: data.sale_from_date,
                        saleEndDate: data.sale_end_date,
                        merchantReleaseDate: data.merchant_release_date,
                        itemPackageQuantity: data.item_package_quantity,
                        fulfillmentLatency: data.fulfillment_latency,
                        restockDate: data.restock_date,
                        maxAggregateShipQuantity: data.max_aggregate_ship_quantity,
                        offeringCanBeGiftMessaged: data.offering_can_be_gift_messaged,
                        offeringCanBeGiftwrapped: data.offering_can_be_giftwrapped,
                        isDiscontinuedByManufacturer: data.is_discontinued_by_manufacturer,
                        maxOrderQuantity: data.max_order_quantity,
                        offeringStartDate: data.offering_start_date
                    }
                });
                managerUploadReq.productDetails = mur;
                $scope.onGetUser = true;

                console.log("=================");
                console.log(managerUploadReq);
                UploadCatalogueService.managerUploadCatalogue(managerUploadReq).success(function (result) {
                    if (result.responseCode === 0) {
                        //     $scope.onGetUser = false;


                        console.log(result);
                        getAllProducts();

                    } else {
                        //   $scope.onGetUser = false;
                        $scope.addAlerts.alert = true;
                        $scope.addAlerts.type = 'danger';
                        $scope.addAlerts.msg = result.errorMsg;
                    }
                }).
                    error(function (data, status, headers, config) {
                        //$scope.onGetUser = false;
                        $scope.addAlerts.alert = true;
                        $scope.addAlerts.type = 'danger';
                        $scope.addAlerts.msg = SharedService.getErrorMessage(status);
                    });


            };

            $scope.populateSeller = function () {

                $scope.alerts.alert = false;

                if ($scope.selectedManager === "Select") {
                    $scope.alerts.alert = true;
                    $scope.alerts.type = 'warning';
                    $scope.alerts.msg = "Please Select Manager to display the Seller List!!";

                    $scope.sellerList = ["Select"];
                    $scope.selectedSeller = "Select";

                    $scope.orderDetailsGridData = [];

                } else {
                    var getASRequest = {
                        "userName": userName,
                        "user": {
                            "managerUserName": $scope.selectedManager
                        }
                    };

                    $scope.onSyncFS = true;
                    SharedService.getAllocateSellers(getASRequest).success(function (result) {
                        $scope.onSyncFS = false;
                        if (result.responseCode === 0 && result.response.allocatedUser) {

                            _.forEach(result.response.allocatedUser, function (data) {
                                $scope.sellerList.push(data.value);
                            });


                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                        error(function (data, status, headers, config) {
                            $scope.onGetSeller = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = SharedService.getErrorMessage(status);
                        });
                }
            };
            $scope.getAP = function () {
                getAllProducts();
            }
            getAllProducts = function () {

                $scope.onGetUser = true;
                request = {
                    "userName": $scope.selectedSeller
                };
                $scope.productDetailsData = [];
                UploadCatalogueService.getAllProducts(request).success(function (result) {
                    if (result.responseCode === 0) {
                        $scope.onGetUser = false;
                        excelFormatJson = result.response.productDetails.map((data) => {
                            return {
                                id: data.id,
                                status: data.status,
                                item_type: data.itemType,
                                item_sku: data.itemSku,
                                external_product_id: data.externalProductId,
                                external_product_id_type: data.externalProductIdType,
                                brand_name: data.brandName,
                                item_name: data.itemName,
                                manufacturer: data.manufacturer,
                                department_name1: data.departmentName1,
                                department_name2: data.departmentName2,
                                department_name3: data.departmentName3,
                                department_name4: data.departmentName4,
                                department_name5: data.departmentName5,
                                material_type1: data.materialType1,
                                material_type2: data.materialType2,
                                material_type3: data.materialType3,
                                material_type4: data.materialType4,
                                material_type5: data.materialType5,
                                metal_type: data.metalType,
                                setting_type: data.settingType,
                                gem_type: data.gemType,
                                standard_price: data.standardPrice,
                                quantity: data.quantity,
                                merchant_shipping_group_name: data.merchantShippingGroupName,
                                main_offer_image: data.mainOfferImage,
                                swatch_image_url: data.swatchImageUrl,
                                offer_image1: data.offerImage1,
                                offer_image2: data.offerImage2,
                                offer_image3: data.offerImage3,
                                offer_image4: data.offerImage4,
                                offer_image5: data.offerImage5,
                                offer_image6: data.offerImage6,
                                offer_image7: data.offerImage7,
                                offer_image8: data.offerImage8,
                                offer_image: data.offerImage,
                                feed_product_type: data.feedProductType,
                                update_delete: data.updateDelete,
                                product_description: data.productDescription,
                                bullet_point1: data.bulletPoint1,
                                bullet_point2: data.bulletPoint2,
                                bullet_point3: data.bulletPoint3,
                                bullet_point4: data.bulletPoint4,
                                bullet_point5: data.bulletPoint5,
                                target_audience_keywords1: data.targetAudienceKeywords1,
                                target_audience_keywords2: data.targetAudienceKeywords2,
                                target_audience_keywords3: data.targetAudienceKeywords3,
                                target_audience_keywords4: data.targetAudienceKeywords4,
                                target_audience_keywords5: data.targetAudienceKeywords5,
                                specific_uses_keywords1: data.specificUsesKeywords1,
                                specific_uses_keywords2: data.specificUsesKeywords2,
                                specific_uses_keywords3: data.specificUsesKeywords3,
                                specific_uses_keywords4: data.specificUsesKeywords4,
                                specific_uses_keywords5: data.specificUsesKeywords5,
                                generic_keywords1: data.genericKeywords1,
                                generic_keywords2: data.genericKeywords2,
                                generic_keywords3: data.genericKeywords3,
                                generic_keywords4: data.genericKeywords4,
                                generic_keywords5: data.genericKeywords5,
                                website_shipping_weight: data.websiteShippingWeight,
                                website_shipping_weight_unit_of_measure: data.websiteShippingWeightUnitOfMeasure,
                                display_dimensions_unit_of_measure: data.displayDimensionsUnitOfMeasure,
                                item_display_diameter: data.itemDisplayDiameter,
                                item_display_height: data.itemDisplayHeight,
                                item_display_width: data.itemDisplayWidth,
                                item_display_length: data.itemDisplayLength,
                                item_length: data.itemLength,
                                item_width: data.itemWidth,
                                item_height: data.itemHeight,
                                item_dimensions_unit_of_measure: data.itemDimensionsUnitOfMeasure,
                                item_display_weight: data.itemDisplayWeight,
                                item_display_weight_unit_of_measure: data.itemDisplayWeightUnitOfMeasure,
                                fulfillment_center_id: data.fulfillmentCenterId,
                                package_length: data.packageLength,
                                package_height: data.packageHeight,
                                package_width: data.packageWidth,
                                package_dimensions_unit_of_measure: data.packageDimensionsUnitOfMeasure,
                                package_weight: data.packageWeight,
                                package_weight_unit_of_measure: data.packageWeightUnitOfMeasure,
                                country_of_origin: data.countryOfOrigin,
                                prop_65: data.prop65,
                                cpsia_cautionary_statement1: data.cpsiaCautionaryStatement1,
                                cpsia_cautionary_statement2: data.cpsiaCautionaryStatement2,
                                cpsia_cautionary_statement3: data.cpsiaCautionaryStatement3,
                                cpsia_cautionary_statement4: data.cpsiaCautionaryStatement4,
                                cpsia_cautionary_description: data.cpsiaCautionaryDescription,
                                fabric_type1: data.fabricType1,
                                fabric_type2: data.fabricType2,
                                fabric_type3: data.fabricType3,
                                fabric_type4: data.fabricType4,
                                fabric_type5: data.fabricType5,
                                fabric_type6: data.fabricType6,
                                fabric_type7: data.fabricType7,
                                fabric_type8: data.fabricType8,
                                fabric_type9: data.fabricType9,
                                fabric_type10: data.fabricType10,
                                import_designation: data.importDesignation,
                                condition_type: data.conditionType,
                                condition_note: data.conditionNote,
                                currency: data.currency,
                                product_site_launch_date: data.productSiteLaunchDate,
                                product_tax_code: data.productTaxCode,
                                list_price: data.listPrice,
                                sale_price: data.salePrice,
                                sale_from_date: data.saleFromDate,
                                sale_end_date: data.saleEndDate,
                                merchant_release_date: data.merchantReleaseDate,
                                item_package_quantity: data.itemPackageQuantity,
                                fulfillment_latency: data.fulfillmentLatency,
                                restock_date: data.restockDate,
                                max_aggregate_ship_quantity: data.maxAggregateShipQuantity,
                                offering_can_be_gift_messaged: data.offeringCanBeGiftMessaged,
                                offering_can_be_giftwrapped: data.offeringCanBeGiftwrapped,
                                is_discontinued_by_manufacturer: data.isDiscontinuedByManufacturer,
                                max_order_quantity: data.maxOrderQuantity,
                                offering_start_date: data.offeringStartDate
                            }
                        });

                        console.log('response from server', excelFormatJson);

                        excelFormatJson.forEach(function (data) {

                            $scope.productDetailsData.push(data);

                        });
                    } else {
                        $scope.onGetUser = false;
                        $scope.alert.alert = true;
                        $scope.alert.type = 'danger';
                        $scope.alert.msg = result.errorMsg;
                    }
                }).
                    error(function (data, status, headers, config) {
                        $scope.onGetUser = false;
                        $scope.alert.alert = true;
                        $scope.alert.type = 'danger';
                        $scope.alert.msg = SharedService.getErrorMessage(status);
                    });
            };


            if ($scope.isSeller == true) {
                console.log("Seller Logged In..." + $scope.selectedSeller);
                getAllProducts();
            }


            if ($scope.isManager == true) {
                console.log("Manager Logged in " + $scope.selectedManager);

                $scope.populateSeller();
            }

            $scope.getProductList = function () {
                console.log("Inside Product List");
            }
            $scope.productDetailsData = [];
            $scope.selectedRow = [];
            $scope.productDetails = {};
            $scope.productDetails.data = 'productDetailsData';
            $scope.productDetails.enableRowSelection = $scope.isManager ? true : false;
            $scope.productDetails.enableSelectAll = $scope.isManager ? true : false;
            $scope.productDetails.selectionRowHeaderWidth = 35;
            $scope.productDetails.enableSorting = true;
            $scope.productDetails.enableColumnResizing = true;
            $scope.productDetails.enableFiltering = false;
            $scope.productDetails.enableGridMenu = true;
            $scope.productDetails.enableRowHeaderSelection = $scope.isManager ? true : false;
            $scope.productDetails.modifierKeysToMultiSelect = false;
            $scope.productDetails.noUnselect = false;
            $scope.productDetails.rowHeight = 35
            $scope.productDetails.showGridFooter = true;
            $scope.productDetails.showColumnFooter = false;
            $scope.productDetails.paginationPageSizes = [10, 20, 30];
            $scope.productDetails.paginationPageSize = 10;
            $scope.productDetails.exporterMenuCsv = false;
            $scope.productDetails.exporterMenuPdf = false;
            $scope.productDetails.enableFullRowSelection = true;
            $scope.productDetails.multiSelect = true;


            $scope.productDetails.columnDefs = [
                /*{
                    displayName: 'Id',
                    name: 'id',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                },*/
                {
                    displayName: 'Status',
                    name: 'status',
                    width: 80,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    displayName: 'Item type',
                    name: 'item_type',
                    width: 80,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item sku',
                    name: 'item_sku',
                    width: 80,
                    enableColumnMenu: false,
                    visible: true
                },
                {
                    displayName: 'External product id',
                    name: 'external_product_id',
                    width: 80,
                    enableColumnMenu: false,
                    visible: true
                }, /*{
                                   displayName: 'External product id type',
                                   name: 'external_product_id_type',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Brand name',
                                   name: 'brand_name',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, */
                {
                    displayName: 'Item name',
                    name: 'item_name',
                    width: 80,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Manufacturer',
                    name: 'manufacturer',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, /*{
                                   displayName: 'Department name1',
                                   name: 'department_name1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Department name2',
                                   name: 'department_name2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Department name3',
                                   name: 'department_name3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Department name4',
                                   name: 'department_name4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Department name5',
                                   name: 'department_name5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Material type1',
                                   name: 'material_type1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Material type2',
                                   name: 'material_type2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Material type3',
                                   name: 'material_type3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Material type4',
                                   name: 'material_type4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Material type5',
                                   name: 'material_type5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Metal type',
                                   name: 'metal_type',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Setting type',
                                   name: 'setting_type',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Gem type',
                                   name: 'gem_type',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Standard price',
                                   name: 'standard_price',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, */{
                    displayName: 'Quantity',
                    name: 'quantity',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, /*{
                                   displayName: 'Merchant shipping group name',
                                   name: 'merchant_shipping_group_name',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Main offer image',
                                   name: 'main_offer_image',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Swatch image url',
                                   name: 'swatch_image_url',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image1',
                                   name: 'offer_image1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image2',
                                   name: 'offer_image2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image3',
                                   name: 'offer_image3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image4',
                                   name: 'offer_image4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image5',
                                   name: 'offer_image5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image6',
                                   name: 'offer_image6',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image7',
                                   name: 'offer_image7',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer_image8',
                                   name: 'offer_image8',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Main offer image',
                                   name: 'main_offer_image',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Offer image',
                                   name: 'offer_image',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Feed product type',
                                   name: 'feed_product_type',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Update delete',
                                   name: 'update_delete',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Product description',
                                   name: 'product_description',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Bullet point1',
                                   name: 'bullet_point1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Bullet point2',
                                   name: 'bullet_point2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Bullet point3',
                                   name: 'bullet_point3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Bullet point4',
                                   name: 'bullet_point4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Bullet point5',
                                   name: 'bullet_point5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Target audience keywords1',
                                   name: 'target_audience_keywords1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Target audience keywords2',
                                   name: 'target_audience_keywords2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Target audience keywords3',
                                   name: 'target_audience_keywords3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Target audience keywords4',
                                   name: 'target_audience_keywords4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Target audience keywords5',
                                   name: 'target_audience_keywords5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Specific uses keywords1',
                                   name: 'specific_uses_keywords1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Specific uses keywords2',
                                   name: 'specific_uses_keywords2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Specific uses keywords3',
                                   name: 'specific_uses_keywords3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Specific uses keywords4',
                                   name: 'specific_uses_keywords4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Specific uses keywords5',
                                   name: 'specific_uses_keywords5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Generic keywords1',
                                   name: 'generic_keywords1',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Generic keywords2',
                                   name: 'generic_keywords2',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Generic keywords3',
                                   name: 'generic_keywords3',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Generic keywords4',
                                   name: 'generic_keywords4',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Generic keywords5',
                                   name: 'generic_keywords5',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Website shipping weight',
                                   name: 'website_shipping_weight',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Website shipping weight unit of measure',
                                   name: 'website_shipping_weight_unit_of_measure',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Display dimensions unit of measure',
                                   name: 'display_dimensions_unit_of_measure',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Item display diameter',
                                   name: 'item_display_diameter',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Item display height',
                                   name: 'item_display_height',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Item display width',
                                   name: 'item_display_width',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               }, {
                                   displayName: 'Item display length',
                                   name: 'item_display_length',
                                   width: 60,
                                   enableColumnMenu: false,
                                   visible: true
                               },*/
                /*{
                    displayName: 'Item length',
                    name: 'item_length',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item width',
                    name: 'item_width',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item height',
                    name: 'item_height',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item dimensions unit of measure',
                    name: 'item_dimensions_unit_of_measure',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item display weight',
                    name: 'item_display_weight',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item display weight unit of measure',
                    name: 'item_display_weight_unit_of_measure',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fulfillment center id',
                    name: 'fulfillment_center_id',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Package length',
                    name: 'package_length',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Package height',
                    name: 'package_height',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Package width',
                    name: 'package_width',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Package dimensions unit of measure',
                    name: 'package_dimensions_unit_of_measure',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Package weight',
                    name: 'package_weight',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Package weight unit of measure',
                    name: 'package_weight_unit_of_measure',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Country of origin',
                    name: 'country_of_origin',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Prop 65',
                    name: 'prop_65',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Cpsia cautionary statement1',
                    name: 'cpsia_cautionary_statement1',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Cpsia cautionary statement2',
                    name: 'cpsia_cautionary_statement2',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Cpsia cautionary statement3',
                    name: 'cpsia_cautionary_statement3',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Cpsia cautionary statement4',
                    name: 'cpsia_cautionary_statement4',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Cpsia cautionary description',
                    name: 'cpsia_cautionary_description',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type1',
                    name: 'fabric_type1',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type2',
                    name: 'fabric_type2',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type3',
                    name: 'fabric_type3',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type4',
                    name: 'fabric_type4',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type5',
                    name: 'fabric_type5',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type6',
                    name: 'fabric_type6',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type7',
                    name: 'fabric_type7',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type8',
                    name: 'fabric_type8',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type9',
                    name: 'fabric_type9',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fabric type10',
                    name: 'fabric_type10',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Import designation',
                    name: 'import_designation',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Condition type',
                    name: 'condition_type',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Condition note',
                    name: 'condition_note',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Currency',
                    name: 'currency',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Product site launch date',
                    name: 'product_site_launch_date',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Product tax code',
                    name: 'product_tax_code',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'List price',
                    name: 'list_price',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Sale price',
                    name: 'sale_price',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Sale from date',
                    name: 'sale_from_date',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Sale end date',
                    name: 'sale_end_date',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Merchant release date',
                    name: 'merchant_release_date',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Item package quantity',
                    name: 'item_package_quantity',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Fulfillment latency',
                    name: 'fulfillment_latency',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Restock date',
                    name: 'restock_date',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Max aggregate ship quantity',
                    name: 'max_aggregate_ship_quantity',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Offering can be gift messaged',
                    name: 'offering_can_be_gift_messaged',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Offering can be giftwrapped',
                    name: 'offering_can_be_giftwrapped',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }, {
                    displayName: 'Is discontinued by manufacturer',
                    name: 'is_discontinued_by_manufacturer',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                },*/ {
                    displayName: 'Max order quantity',
                    name: 'max_order_quantity',
                    width: 160,
                    enableColumnMenu: false,
                    visible: true
                }/*, {
                    displayName: 'Offering start date',
                    name: 'offering_start_date',
                    width: 60,
                    enableColumnMenu: false,
                    visible: true
                }*/
            ];

            $scope.toggleMultiSelect = function () {
                $scope.gridApi.selection.setMultiSelect(!$scope.gridApi.grid.options.multiSelect);
            };

            $scope.toggleModifierKeysToMultiSelect = function () {
                $scope.gridApi.selection.setModifierKeysToMultiSelect(!$scope.gridApi.grid.options.modifierKeysToMultiSelect);
            };

            $scope.selectAll = function () {
                $scope.gridApi.selection.selectAllRows();
            };

            $scope.clearAll = function () {
                $scope.gridApi.selection.clearSelectedRows();
            };

            $scope.toggleRow1 = function () {
                $scope.gridApi.selection.toggleRowSelection($scope.productDetails.data[0]);
            };

            $scope.toggleFullRowSelection = function () {
                $scope.productDetails.enableFullRowSelection = !$scope.productDetails.enableFullRowSelection;
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            };




            $scope.setSelectable = function () {
                $scope.gridApi.selection.clearSelectedRows();
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            };


            $scope.productDetails.onRegisterApi = function (gridApi) {
                //set gridApi on scope
                $scope.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    var msg = 'row selected ' + row.isSelected;

                    console.log($scope.gridApi.selection.getSelectedRows().length);
                    if ($scope.gridApi.selection.getSelectedRows().length > 0) {
                        $scope.disableUploadButton = false;
                        console.log($scope.disableUploadButton);
                    } else {
                        $scope.disableUploadButton = true;
                        console.log($scope.disableUploadButton);

                    }

                });

                gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                    var msg = 'rows changed ' + rows.length;
                    console.log($scope.gridApi.selection.getSelectedRows().length);

                    if ($scope.gridApi.selection.getSelectedRows().length > 0) {
                        $scope.disableUploadButton = false;
                        console.log($scope.disableUploadButton);

                    } else {
                        $scope.disableUploadButton = true;
                        console.log($scope.disableUploadButton);

                    }
                });


            };

            $scope.selectRow = function () {
                console.log($scope.gridApi.selection.getSelectedRows());
            };

            $scope.load_excel = function () {
                if (groupName !== "SELLER") {
                    $scope.onSyncFS = true;

                    var getManagerListReq = {
                        "userName": userName
                    };
                    SharedService.getManagerRole(getManagerListReq).success(function (result) {
                        $scope.onSyncFS = false;
                        if (result.responseCode === 0) {
                            result.response.managerUsers.forEach(function (row) {
                                $scope.managerList.push(row.userName);
                            });
                        } else {
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = result.errorMsg;
                            $scope.disableSubmit = false;
                        }
                    }).
                        error(function (data, status, headers, config) {
                            $scope.onSyncFS = false;
                            $scope.alerts.alert = true;
                            $scope.alerts.type = 'danger';
                            $scope.alerts.msg = SharedService.getErrorMessage(status);
                        });
                }
                var oFileIn;
                oFileIn = document.getElementById('cat-file');
                if (oFileIn.addEventListener) {
                    console.log("Inside Upload Catalogue function");
                    oFileIn.addEventListener('change', filePicked, false);
                }

            }

            filePicked = function (oEvent) {
                var ext = this.value.match(/\.([^\.]+)$/)[1];
                switch (ext) {
                    case 'xlsx':
                        break;
                    case 'xlsm':
                        break;
                    default:
                        alert('not allowed');
                        this.value = '';
                }

                // Get The File From The Input
                var oFile = oEvent.target.files[0];

                $scope.fileName = oFile.name;
                $scope.$apply();
                // Create A File Reader HTML5
                var reader = new FileReader();

                // Ready The Event For When A File Gets Selected
                reader.onload = function (e) {
                    var data = e.target.result;
                    var cfb = XLSX.read(data, {
                        type: 'binary'
                    });
                    cfb.SheetNames.forEach(function (sheetName) {
                        // Obtain The Current Row As CSV
                        var oJS = XLS.utils.sheet_to_json(cfb.Sheets[sheetName]);

                        $scope.oJS = oJS
                    });
                };

                // Tell JS To Start Reading The File.. You could delay this if desired
                reader.readAsBinaryString(oFile);
            }

            $scope.uploadToServer = function () {
                console.log("Uploading to server....");

                uploadRequest = {
                    "userName": $scope.selectedSeller,
                    "marketPlace": $scope.selectedMP,
                    "productCategory": $scope.selectedCat,
                    "productDetails": [],
                }
                var excelFormat = [];
                $scope.oJS.forEach(function (data) {
                    console.log(data);
                    excelFormat.push(data);
                    // uploadRequest.productDetails.push(data);
                });

                serverRequestFormat = excelFormat.map((data) => {
                    return {
                        itemType: data.item_type,
                        itemSku: data.item_sku,
                        externalProductId: data.external_product_id,
                        externalProductIdType: data.external_product_id_type,
                        brandName: data.brand_name,
                        itemName: data.item_name,
                        manufacturer: data.manufacturer,
                        departmentName1: data.department_name1,
                        departmentName2: data.department_name2,
                        departmentName3: data.department_name3,
                        departmentName4: data.department_name4,
                        departmentName5: data.department_name5,
                        materialType1: data.material_type1,
                        materialType2: data.material_type2,
                        materialType3: data.material_type3,
                        materialType4: data.material_type4,
                        materialType5: data.material_type5,
                        metalType: data.metal_type,
                        settingType: data.setting_type,
                        gemType: data.gem_type,
                        standardPrice: data.standard_price,
                        quantity: data.quantity,
                        merchantShippingGroupName: data.merchant_shipping_group_name,
                        mainOfferImage: data.main_offer_image,
                        swatchImageUrl: data.swatch_image_url,
                        offerImage1: data.offer_image1,
                        offerImage2: data.offer_image2,
                        offerImage3: data.offer_image3,
                        offerImage4: data.offer_image4,
                        offerImage5: data.offer_image5,
                        offerImage6: data.offer_image6,
                        offerImage7: data.offer_image7,
                        offerImage8: data.offer_image8,
                        offerImage: data.offer_image,
                        feedProductType: data.feed_product_type,
                        updateDelete: data.update_delete,
                        productDescription: data.product_description,
                        bulletPoint1: data.bullet_point1,
                        bulletPoint2: data.bullet_point2,
                        bulletPoint3: data.bullet_point3,
                        bulletPoint4: data.bullet_point4,
                        bulletPoint5: data.bullet_point5,
                        targetAudienceKeywords1: data.target_audience_keywords1,
                        targetAudienceKeywords2: data.target_audience_keywords2,
                        targetAudienceKeywords3: data.target_audience_keywords3,
                        targetAudienceKeywords4: data.target_audience_keywords4,
                        targetAudienceKeywords5: data.target_audience_keywords5,
                        specificUsesKeywords1: data.specific_uses_keywords1,
                        specificUsesKeywords2: data.specific_uses_keywords2,
                        specificUsesKeywords3: data.specific_uses_keywords3,
                        specificUsesKeywords4: data.specific_uses_keywords4,
                        specificUsesKeywords5: data.specific_uses_keywords5,
                        genericKeywords1: data.generic_keywords1,
                        genericKeywords2: data.generic_keywords2,
                        genericKeywords3: data.generic_keywords3,
                        genericKeywords4: data.generic_keywords4,
                        genericKeywords5: data.generic_keywords5,
                        websiteShippingWeight: data.website_shipping_weight,
                        websiteShippingWeightUnitOfMeasure: data.website_shipping_weight_unit_of_measure,
                        displayDimensionsUnitOfMeasure: data.display_dimensions_unit_of_measure,
                        itemDisplayDiameter: data.item_display_diameter,
                        itemDisplayHeight: data.item_display_height,
                        itemDisplayWidth: data.item_display_width,
                        itemDisplayLength: data.item_display_length,
                        itemLength: data.item_length,
                        itemWidth: data.item_width,
                        itemHeight: data.item_height,
                        itemDimensionsUnitOfMeasure: data.item_dimensions_unit_of_measure,
                        itemDisplayWeight: data.item_display_weight,
                        itemDisplayWeightUnitOfMeasure: data.item_display_weight_unit_of_measure,
                        fulfillmentCenterId: data.fulfillment_center_id,
                        packageLength: data.package_length,
                        packageHeight: data.package_height,
                        packageWidth: data.package_width,
                        packageDimensionsUnitOfMeasure: data.package_dimensions_unit_of_measure,
                        packageWeight: data.package_weight,
                        packageWeightUnitOfMeasure: data.package_weight_unit_of_measure,
                        countryOfOrigin: data.country_of_origin,
                        prop65: data.prop_65,
                        cpsiaCautionaryStatement1: data.cpsia_cautionary_statement1,
                        cpsiaCautionaryStatement2: data.cpsia_cautionary_statement2,
                        cpsiaCautionaryStatement3: data.cpsia_cautionary_statement3,
                        cpsiaCautionaryStatement4: data.cpsia_cautionary_statement4,
                        cpsiaCautionaryDescription: data.cpsia_cautionary_description,
                        fabricType1: data.fabric_type1,
                        fabricType2: data.fabric_type2,
                        fabricType3: data.fabric_type3,
                        fabricType4: data.fabric_type4,
                        fabricType5: data.fabric_type5,
                        fabricType6: data.fabric_type6,
                        fabricType7: data.fabric_type7,
                        fabricType8: data.fabric_type8,
                        fabricType9: data.fabric_type9,
                        fabricType10: data.fabric_type10,
                        importDesignation: data.import_designation,
                        conditionType: data.condition_type,
                        conditionNote: data.condition_note,
                        currency: data.currency,
                        productSiteLaunchDate: data.product_site_launch_date,
                        productTaxCode: data.product_tax_code,
                        listPrice: data.list_price,
                        salePrice: data.sale_price,
                        saleFromDate: data.sale_from_date,
                        saleEndDate: data.sale_end_date,
                        merchantReleaseDate: data.merchant_release_date,
                        itemPackageQuantity: data.item_package_quantity,
                        fulfillmentLatency: data.fulfillment_latency,
                        restockDate: data.restock_date,
                        maxAggregateShipQuantity: data.max_aggregate_ship_quantity,
                        offeringCanBeGiftMessaged: data.offering_can_be_gift_messaged,
                        offeringCanBeGiftwrapped: data.offering_can_be_giftwrapped,
                        isDiscontinuedByManufacturer: data.is_discontinued_by_manufacturer,
                        maxOrderQuantity: data.max_order_quantity,
                        offeringStartDate: data.offering_start_date
                    }
                });
                console.log('========================================');
                console.log(serverRequestFormat);
                console.log("Request to be sent....");
                console.log(uploadRequest);
                uploadRequest.productDetails = serverRequestFormat;


                UploadCatalogueService.uploadCatalogue(uploadRequest).success(function (result) {

                    if (result.responseCode === 0) {
                        console.log("success from api");
                        console.log(result);
                        getAllProducts();

                    } else {
                        $scope.onCreate = false;
                        $scope.addAlerts.alert = true;
                        $scope.addAlerts.type = 'danger';
                        $scope.addAlerts.msg = result.errorMsg;
                    }
                }).
                    error(function (data, status, headers, config) {
                        $scope.onCreate = false;
                        $scope.addAlerts.alert = true;
                        $scope.addAlerts.type = 'danger';
                        $scope.addAlerts.msg = SharedService.getErrorMessage(status);
                    });

            };




            $scope.load_excel();
        }
    ]);
