/*jslint browser: true*/
/*global jQuery*/
/*jslint vars: true*/

(function ($) {
    $.fn.bootstrapDynamicTabs = function () {

		// Main functions for each instantiated responsive tabs
		this.each(function () {

			var $container = $(this);
			var DynamicTabs = (function () {
				function DynamicTabs() {

					var TABS_OBJECT;
					TABS_OBJECT = this;
					TABS_OBJECT.activeTabId = 1;
					TABS_OBJECT.tabsHorizontalContainer = $container;
					TABS_OBJECT.tabsHorizontalContainer.addClass("dynamic-tabs").wrap("<div class='dynamic-tabs-container clearfix'></div>");

					// Update tabs
					var update_tabs = function () {

						var i, horizontalTab, tabId, verticalTab, tabWidth, isVisible;

						// Determine which tabs to show/hide
						var $tabs = TABS_OBJECT.tabsHorizontalContainer.children('li');
						var activeTab = TABS_OBJECT.tabsHorizontalContainer.find(".dynamic-tab[tab-id=" + TABS_OBJECT.activeTabId + "]");
						var activeTabIndex = activeTab.index();
						var availableWidth = TABS_OBJECT.tabsHorizontalContainer.width();
						var numVisibleHorizontalTabs = 1;

						// active tab is always visible
						horizontalTab = $tabs.eq(activeTabIndex);
						tabId = horizontalTab.attr("tab-id");
						horizontalTab.toggleClass('hidden', false);
						availableWidth = availableWidth - horizontalTab.outerWidth(true);

						// from active to firt
						for (i = activeTabIndex - 1; i >= 0; i--) {
							horizontalTab = $tabs.eq(i);
							if (availableWidth > 0) {
								horizontalTab.toggleClass('hidden', false);
								tabWidth = horizontalTab.outerWidth(true);
								isVisible = tabWidth <= availableWidth;
								if (isVisible) {
									availableWidth = availableWidth - tabWidth;
									numVisibleHorizontalTabs++;
								} else {
									availableWidth = -1;
								}
							} else {
								isVisible = false;
							}
							horizontalTab.toggleClass('hidden', !isVisible);
						}

						// from active to last
						for (i = activeTabIndex + 1; i < $tabs.length; i++) {
							horizontalTab = $tabs.eq(i);
							if (availableWidth > 0) {
								horizontalTab.toggleClass('hidden', false);
								tabWidth = horizontalTab.outerWidth(true);
								isVisible = tabWidth <= availableWidth;
								if (isVisible) {
									availableWidth = availableWidth - tabWidth;
									numVisibleHorizontalTabs++;
								} else {
									availableWidth = -1;
								}
							} else {
								isVisible = false;
							}
							horizontalTab.toggleClass('hidden', !isVisible);
						}

						// Toggle the Tabs dropdown if there are more tabs than can fit in the tabs horizontal container
						var numVisibleVerticalTabs = $tabs.length - numVisibleHorizontalTabs;
						var hasVerticalTabs = (numVisibleVerticalTabs > 0);
						TABS_OBJECT.tabsHorizontalContainer.siblings(".tabs-dropdown").toggleClass("hidden", !hasVerticalTabs);
					};

					var onDropDow = function () {
						// Clone each tab into the dropdown
						TABS_OBJECT.tabsVerticalContainer.html("");
						TABS_OBJECT.tabsHorizontalContainer.children('li').clone().appendTo(TABS_OBJECT.tabsVerticalContainer);
						TABS_OBJECT.tabsVerticalContainer.children('li').toggleClass("hidden");
						TABS_OBJECT.tabsVerticalContainer.children('li').on("click", function (e) {
							TABS_OBJECT.activeTabId = $(this).attr("tab-id");
							TABS_OBJECT.tabsHorizontalContainer.find("[tab-id=" + TABS_OBJECT.activeTabId + "]").tab("show");
							update_tabs();
						});	
					};

					// setup
					var setup = (function () {
						// Reset all tabs for calc function
						var totalWidth = 0;
						var $tabs      = TABS_OBJECT.tabsHorizontalContainer.children('li');

						// Stop function if there are no tabs in container
						if ($tabs.length === 0) {
							return;
						}

						// Mark each tab with a 'tab-id' for easy access
						$tabs.each(function (i) {
							var tabIndex;
							tabIndex = $(this).index();
							$(this)
								.addClass("dynamic-tab")
								.attr("tab-id", i + 1)
								.attr("tab-index", tabIndex);
						});

						// Attach a dropdown to the right of the tabs bar
						// This will be toggled if tabs can't fit in a given viewport size
						TABS_OBJECT.tabsHorizontalContainer.after(
							"<div class='nav navbar-nav navbar-right dropdown tabs-dropdown'><a href='#' class='dropdown-toggle' data-toggle='dropdown'><span class='glyphicon glyphicon-th-list'/></a><ul class='dropdown-menu' role='menu'><div class='dropdown-header visible-xs'><p class='count'>Tabs</p><button type='button' class='close' data-dismiss='dropdown'><span aria-hidden='true'>&times;</span></button><div class='divider visible-xs'></div></div></ul></div>"
						);
						TABS_OBJECT.tabsVerticalContainer = TABS_OBJECT.tabsHorizontalContainer.siblings(".tabs-dropdown").find(".dropdown-menu");
						TABS_OBJECT.tabsHorizontalContainer.siblings(".tabs-dropdown").on('show.bs.dropdown', onDropDow);

						// Update tabs
						update_tabs();
					}());


					// Update tabs on window resize
					$(window).resize(function () {
						update_tabs();
					});
				}

				return new DynamicTabs();
			}());
		});
	};
}(jQuery));
