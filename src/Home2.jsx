import React from 'react';

const Home = () => {

	return(
		<>
		<div className="pre-loader">
			<div className="pre-loader-box">
				<div className="loader-logo">
					<img src="vendors/images/deskapp-logo.svg" alt="" />
				</div>
				<div className="loader-progress" id="progress_div">
					<div className="bar" id="bar1"></div>
				</div>
				<div className="percent" id="percent1">0%</div>
				<div className="loading-text">Loading...</div>
			</div>
		</div>

		<div className="header">
			<div className="header-left">
				<div className="menu-icon bi bi-list"></div>
				<div
					className="search-toggle-icon bi bi-search"
					data-toggle="header_search"
				></div>
				<div className="header-search">
					<form>
						<div className="form-group mb-0">
							<i className="dw dw-search2 search-icon"></i>
							<input
								type="text"
								className="form-control search-input"
								placeholder="Search Here"
							/>
							<div className="dropdown">
								<a
									className="dropdown-toggle no-arrow"
									href="#"
									role="button"
									data-toggle="dropdown"
								>
									<i className="ion-arrow-down-c"></i>
								</a>
								<div className="dropdown-menu dropdown-menu-right">
									<div className="form-group row">
										<label className="col-sm-12 col-md-2 col-form-label"
											>From</label
										>
										<div className="col-sm-12 col-md-10">
											<input
												className="form-control form-control-sm form-control-line"
												type="text"
											/>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-12 col-md-2 col-form-label">To</label>
										<div className="col-sm-12 col-md-10">
											<input
												className="form-control form-control-sm form-control-line"
												type="text"
											/>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-sm-12 col-md-2 col-form-label"
											>Subject</label
										>
										<div className="col-sm-12 col-md-10">
											<input
												className="form-control form-control-sm form-control-line"
												type="text"
											/>
										</div>
									</div>
									<div className="text-right">
										<button className="btn btn-primary">Search</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div className="header-right">
				<div className="dashboard-setting user-notification">
					<div className="dropdown">
						<a
							className="dropdown-toggle no-arrow"
							href="javascript:;"
							data-toggle="right-sidebar"
						>
							<i className="dw dw-settings2"></i>
						</a>
					</div>
				</div>
				<div className="user-notification">
					<div className="dropdown">
						<a
							className="dropdown-toggle no-arrow"
							href="#"
							role="button"
							data-toggle="dropdown"
						>
							<i className="icon-copy dw dw-notification"></i>
							<span className="badge notification-active"></span>
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<div className="notification-list mx-h-350 customscroll">
								<ul>
									<li>
										<a href="#">
											<img src="vendors/images/img.jpg" alt="" />
											<h3>John Doe</h3>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit, sed...
											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<img src="vendors/images/photo1.jpg" alt="" />
											<h3>Lea R. Frith</h3>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit, sed...
											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<img src="vendors/images/photo2.jpg" alt="" />
											<h3>Erik L. Richards</h3>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit, sed...
											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<img src="vendors/images/photo3.jpg" alt="" />
											<h3>John Doe</h3>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit, sed...
											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<img src="vendors/images/photo4.jpg" alt="" />
											<h3>Renee I. Hansen</h3>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit, sed...
											</p>
										</a>
									</li>
									<li>
										<a href="#">
											<img src="vendors/images/img.jpg" alt="" />
											<h3>Vicki M. Coleman</h3>
											<p>
												Lorem ipsum dolor sit amet, consectetur adipisicing
												elit, sed...
											</p>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="user-info-dropdown">
					<div className="dropdown">
						<a
							className="dropdown-toggle"
							href="#"
							role="button"
							data-toggle="dropdown"
						>
							<span className="user-icon">
								<img src="vendors/images/photo1.jpg" alt="" />
							</span>
							<span className="user-name">Ross C. Lopez</span>
						</a>
						<div
							className="dropdown-menu dropdown-menu-right dropdown-menu-icon-list"
						>
							<a className="dropdown-item" href="profile.html"
								><i className="dw dw-user1"></i> Profile</a
							>
							<a className="dropdown-item" href="profile.html"
								><i className="dw dw-settings2"></i> Setting</a
							>
							<a className="dropdown-item" href="faq.html"
								><i className="dw dw-help"></i> Help</a
							>
							<a className="dropdown-item" href="login.html"
								><i className="dw dw-logout"></i> Log Out</a
							>
						</div>
					</div>
				</div>
				<div className="github-link">
					<a href="https://github.com/dropways/deskapp" target="_blank"
						><img src="vendors/images/github.svg" alt=""
					/></a>
				</div>
			</div>
		</div>

		<div className="right-sidebar">
			<div className="sidebar-title">
				<h3 className="weight-600 font-16 text-blue">
					Layout Settings
					<span className="btn-block font-weight-400 font-12"
						>User Interface Settings</span
					>
				</h3>
				<div className="close-sidebar" data-toggle="right-sidebar-close">
					<i className="icon-copy ion-close-round"></i>
				</div>
			</div>
			<div className="right-sidebar-body customscroll">
				<div className="right-sidebar-body-content">
					<h4 className="weight-600 font-18 pb-10">Header Background</h4>
					<div className="sidebar-btn-group pb-30 mb-10">
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary header-white active"
							>White</a
						>
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary header-dark"
							>Dark</a
						>
					</div>

					<h4 className="weight-600 font-18 pb-10">Sidebar Background</h4>
					<div className="sidebar-btn-group pb-30 mb-10">
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary sidebar-light"
							>White</a
						>
						<a
							href="javascript:void(0);"
							className="btn btn-outline-primary sidebar-dark active"
							>Dark</a
						>
					</div>

					<h4 className="weight-600 font-18 pb-10">Menu Dropdown Icon</h4>
					<div className="sidebar-radio-group pb-10 mb-10">
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebaricon-1"
								name="menu-dropdown-icon"
								className="custom-control-input"
								value="icon-style-1"
								checked=""
							/>
							<label className="custom-control-label" htmlFor="sidebaricon-1"
								><i className="fa fa-angle-down"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebaricon-2"
								name="menu-dropdown-icon"
								className="custom-control-input"
								value="icon-style-2"
							/>
							<label className="custom-control-label" htmlFor="sidebaricon-2"
								><i className="ion-plus-round"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebaricon-3"
								name="menu-dropdown-icon"
								className="custom-control-input"
								value="icon-style-3"
							/>
							<label className="custom-control-label" htmlFor="sidebaricon-3"
								><i className="fa fa-angle-double-right"></i
							></label>
						</div>
					</div>

					<h4 className="weight-600 font-18 pb-10">Menu List Icon</h4>
					<div claclassNamess="sidebar-radio-group pb-30 mb-10">
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebariconlist-1"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-1"
								checked=""
							/>
							<label className="custom-control-label" htmlFor="sidebariconlist-1"
								><i className="ion-minus-round"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebariconlist-2"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-2"
							/>
							<label className="custom-control-label" htmlFor="sidebariconlist-2"
								><i className="fa fa-circle-o" aria-hidden="true"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebariconlist-3"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-3"
							/>
							<label className="custom-control-label" htmlFor="sidebariconlist-3"
								><i className="dw dw-check"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebariconlist-4"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-4"
								checked=""
							/>
							<label className="custom-control-label" htmlFor="sidebariconlist-4"
								><i className="icon-copy dw dw-next-2"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebariconlist-5"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-5"
							/>
							<label className="custom-control-label" htmlFor="sidebariconlist-5"
								><i className="dw dw-fast-forward-1"></i
							></label>
						</div>
						<div className="custom-control custom-radio custom-control-inline">
							<input
								type="radio"
								id="sidebariconlist-6"
								name="menu-list-icon"
								className="custom-control-input"
								value="icon-list-style-6"
							/>
							<label className="custom-control-label" htmlFor="sidebariconlist-6"
								><i className="dw dw-next"></i
							></label>
						</div>
					</div>

					<div className="reset-options pt-30 text-center">
						<button className="btn btn-danger" id="reset-settings">
							Reset Settings
						</button>
					</div>
				</div>
			</div>
		</div>

		<div className="left-side-bar">
			<div className="brand-logo">
				<a href="index.html">
					<img src="vendors/images/deskapp-logo.svg" alt="" className="dark-logo" />
					<img
						src="vendors/images/deskapp-logo-white.svg"
						alt=""
						className="light-logo"
					/>
				</a>
				<div className="close-sidebar" data-toggle="left-sidebar-close">
					<i className="ion-close-round"></i>
				</div>
			</div>
			<div className="menu-block customscroll">
				<div className="sidebar-menu">
					<ul id="accordion-menu">
						<li className="dropdown">
							<a href="javascript:;" class="dropdown-toggle">
								<span className="micon bi bi-house"></span
								><span className="mtext">Home</span>
							</a>
							<ul className="submenu">
								<li><a href="index.html">Dashboard style 1</a></li>
								<li><a href="index2.html">Dashboard style 2</a></li>
								<li><a href="index3.html">Dashboard style 3</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-textarea-resize"></span
								><span className="mtext">Forms</span>
							</a>
							<ul className="submenu">
								<li><a href="form-basic.html">Form Basic</a></li>
								<li>
									<a href="advanced-components.html">Advanced Components</a>
								</li>
								<li><a href="form-wizard.html">Form Wizard</a></li>
								<li><a href="html5-editor.html">HTML5 Editor</a></li>
								<li><a href="form-pickers.html">Form Pickers</a></li>
								<li><a href="image-cropper.html">Image Cropper</a></li>
								<li><a href="image-dropzone.html">Image Dropzone</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" class="dropdown-toggle">
								<span class="micon bi bi-table"></span
								><span class="mtext">Tables</span>
							</a>
							<ul className="submenu">
								<li><a href="basic-table.html">Basic Tables</a></li>
								<li><a href="datatable.html">DataTables</a></li>
							</ul>
						</li>
						<li>
							<a href="calendar.html" className="dropdown-toggle no-arrow">
								<span className="micon bi bi-calendar4-week"></span
								><span className="mtext">Calendar</span>
							</a>
						</li>
						<li className="dropdown">
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-archive"></span
								><span className="mtext"> UI Elements </span>
							</a>
							<ul className="submenu">
								<li><a href="ui-buttons.html">Buttons</a></li>
								<li><a href="ui-cards.html">Cards</a></li>
								<li><a href="ui-cards-hover.html">Cards Hover</a></li>
								<li><a href="ui-modals.html">Modals</a></li>
								<li><a href="ui-tabs.html">Tabs</a></li>
								<li>
									<a href="ui-tooltip-popover.html">Tooltip &amp; Popover</a>
								</li>
								<li><a href="ui-sweet-alert.html">Sweet Alert</a></li>
								<li><a href="ui-notification.html">Notification</a></li>
								<li><a href="ui-timeline.html">Timeline</a></li>
								<li><a href="ui-progressbar.html">Progressbar</a></li>
								<li><a href="ui-typography.html">Typography</a></li>
								<li><a href="ui-list-group.html">List group</a></li>
								<li><a href="ui-range-slider.html">Range slider</a></li>
								<li><a href="ui-carousel.html">Carousel</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" class="dropdown-toggle">
								<span className="micon bi bi-command"></span
								><span className="mtext">Icons</span>
							</a>
							<ul className="submenu">
								<li><a href="bootstrap-icon.html">Bootstrap Icons</a></li>
								<li><a href="font-awesome.html">FontAwesome Icons</a></li>
								<li><a href="foundation.html">Foundation Icons</a></li>
								<li><a href="ionicons.html">Ionicons Icons</a></li>
								<li><a href="themify.html">Themify Icons</a></li>
								<li><a href="custom-icon.html">Custom Icons</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" class="dropdown-toggle">
								<span className="micon bi bi-pie-chart"></span
								><span className="mtext">Charts</span>
							</a>
							<ul className="submenu">
								<li><a href="highchart.html">Highchart</a></li>
								<li><a href="knob-chart.html">jQuery Knob</a></li>
								<li><a href="jvectormap.html">jvectormap</a></li>
								<li><a href="apexcharts.html">Apexcharts</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-file-earmark-text"></span
								><span className="mtext">Additional Pages</span>
							</a>
							<ul className="submenu">
								<li><a href="video-player.html">Video Player</a></li>
								<li><a href="login.html">Login</a></li>
								<li><a href="forgot-password.html">Forgot Password</a></li>
								<li><a href="reset-password.html">Reset Password</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-bug"></span
								><span className="mtext">Error Pages</span>
							</a>
							<ul className="submenu">
								<li><a href="400.html">400</a></li>
								<li><a href="403.html">403</a></li>
								<li><a href="404.html">404</a></li>
								<li><a href="500.html">500</a></li>
								<li><a href="503.html">503</a></li>
							</ul>
						</li>

						<li className="dropdown">
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-back"></span
								><span className="mtext">Extra Pages</span>
							</a>
							<ul className="submenu">
								<li><a href="blank.html">Blank</a></li>
								<li><a href="contact-directory.html">Contact Directory</a></li>
								<li><a href="blog.html">Blog</a></li>
								<li><a href="blog-detail.html">Blog Detail</a></li>
								<li><a href="product.html">Product</a></li>
								<li><a href="product-detail.html">Product Detail</a></li>
								<li><a href="faq.html">FAQ</a></li>
								<li><a href="profile.html">Profile</a></li>
								<li><a href="gallery.html">Gallery</a></li>
								<li><a href="pricing-table.html">Pricing Tables</a></li>
							</ul>
						</li>
						<li className="dropdown">
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-hdd-stack"></span
								><span className="mtext">Multi Level Menu</span>
							</a>
							<ul className="submenu">
								<li><a href="javascript:;">Level 1</a></li>
								<li><a href="javascript:;">Level 1</a></li>
								<li><a href="javascript:;">Level 1</a></li>
								<li className="dropdown">
									<a href="javascript:;" className="dropdown-toggle">
										<span className="micon fa fa-plug"></span
										><span className="mtext">Level 2</span>
									</a>
									<ul className="submenu child">
										<li><a href="javascript:;">Level 2</a></li>
										<li><a href="javascript:;">Level 2</a></li>
									</ul>
								</li>
								<li><a href="javascript:;">Level 1</a></li>
								<li><a href="javascript:;">Level 1</a></li>
								<li><a href="javascript:;">Level 1</a></li>
							</ul>
						</li>
						<li>
							<a href="sitemap.html" className="dropdown-toggle no-arrow">
								<span className="micon bi bi-diagram-3"></span
								><span className="mtext">Sitemap</span>
							</a>
						</li>
						<li>
							<a href="chat.html" className="dropdown-toggle no-arrow">
								<span className="micon bi bi-chat-right-dots"></span
								><span className="mtext">Chat</span>
							</a>
						</li>
						<li>
							<a href="invoice.html" className="dropdown-toggle no-arrow">
								<span className="micon bi bi-receipt-cutoff"></span
								><span className="mtext">Invoice</span>
							</a>
						</li>
						<li>
							<div className="dropdown-divider"></div>
						</li>
						<li>
							<div className="sidebar-small-cap">Extra</div>
						</li>
						<li>
							<a href="javascript:;" className="dropdown-toggle">
								<span className="micon bi bi-file-pdf"></span
								><span className="mtext">Documentation</span>
							</a>
							<ul className="submenu">
								<li><a href="introduction.html">Introduction</a></li>
								<li><a href="getting-started.html">Getting Started</a></li>
								<li><a href="color-settings.html">Color Settings</a></li>
								<li>
									<a href="third-party-plugins.html">Third Party Plugins</a>
								</li>
							</ul>
						</li>
						<li>
							<a
								href="https://dropways.github.io/deskapp-free-single-page-website-template/"
								target="_blank"
								className="dropdown-toggle no-arrow"
							>
								<span className="micon bi bi-layout-text-window-reverse"></span>
								<span className="mtext"
									>Landing Page
									<img src="vendors/images/coming-soon.png" alt="" width="25"
								/></span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div className="mobile-menu-overlay"></div>

		<div className="main-container">
			<div className="xs-pd-20-10 pd-ltr-20">
				<div className="title pb-20">
					<h2 className="h3 mb-0">Hospital Overview</h2>
				</div>

				<div className="row pb-10">
					<div className="col-xl-3 col-lg-3 col-md-6 mb-20">
						<div className="card-box height-100-p widget-style3">
							<div className="d-flex flex-wrap">
								<div className="widget-data">
									<div className="weight-700 font-24 text-dark">75</div>
									<div className="font-14 text-secondary weight-500">
										Appointment
									</div>
								</div>
								<div className="widget-icon">
									<div className="icon" data-color="#00eccf">
										<i className="icon-copy dw dw-calendar1"></i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-3 col-md-6 mb-20">
						<div className="card-box height-100-p widget-style3">
							<div className="d-flex flex-wrap">
								<div className="widget-data">
									<div className="weight-700 font-24 text-dark">124,551</div>
									<div className="font-14 text-secondary weight-500">
										Total Patient
									</div>
								</div>
								<div className="widget-icon">
									<div className="icon" data-color="#ff5b5b">
										<span className="icon-copy ti-heart"></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-3 col-md-6 mb-20">
						<div className="card-box height-100-p widget-style3">
							<div className="d-flex flex-wrap">
								<div className="widget-data">
									<div className="weight-700 font-24 text-dark">400+</div>
									<div className="font-14 text-secondary weight-500">
										Total Doctor
									</div>
								</div>
								<div className="widget-icon">
									<div className="icon">
										<i
											className="icon-copy fa fa-stethoscope"
											aria-hidden="true"
										></i>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-lg-3 col-md-6 mb-20">
						<div className="card-box height-100-p widget-style3">
							<div className="d-flex flex-wrap">
								<div className="widget-data">
									<div className="weight-700 font-24 text-dark">$50,000</div>
									<div className="font-14 text-secondary weight-500">Earning</div>
								</div>
								<div className="widget-icon">
									<div className="icon" data-color="#09cc06">
										<i className="icon-copy fa fa-money" aria-hidden="true"></i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="row pb-10">
					<div className="col-md-8 mb-20">
						<div className="card-box height-100-p pd-20">
							<div
								className="d-flex flex-wrap justify-content-between align-items-center pb-0 pb-md-3"
							>
								<div className="h5 mb-md-0">Hospital Activities</div>
								<div className="form-group mb-md-0">
									<select className="form-control form-control-sm selectpicker">
										<option value="">Last Week</option>
										<option value="">Last Month</option>
										<option value="">Last 6 Month</option>
										<option value="">Last 1 year</option>
									</select>
								</div>
							</div>
							<div id="activities-chart"></div>
						</div>
					</div>
					<div className="col-md-4 mb-20">
						<div
							className="card-box min-height-200px pd-20 mb-20"
							data-bgcolor="#455a64"
						>
							<div className="d-flex justify-content-between pb-20 text-white">
								<div className="icon h1 text-white">
									<i className="fa fa-calendar" aria-hidden="true"></i>
								</div>
								<div className="font-14 text-right">
									<div><i className="icon-copy ion-arrow-up-c"></i> 2.69%</div>
									<div className="font-12">Since last month</div>
								</div>
							</div>
							<div className="d-flex justify-content-between align-items-end">
								<div className="text-white">
									<div className="font-14">Appointment</div>
									<div className="font-24 weight-500">1865</div>
								</div>
								<div className="max-width-150">
									<div id="appointment-chart"></div>
								</div>
							</div>
						</div>
						<div className="card-box min-height-200px pd-20" data-bgcolor="#265ed7">
							<div className="d-flex justify-content-between pb-20 text-white">
								<div className="icon h1 text-white">
									<i className="fa fa-stethoscope" aria-hidden="true"></i>
								</div>
								<div className="font-14 text-right">
									<div><i className="icon-copy ion-arrow-down-c"></i> 3.69%</div>
									<div className="font-12">Since last month</div>
								</div>
							</div>
							<div className="d-flex justify-content-between align-items-end">
								<div className="text-white">
									<div className="font-14">Surgery</div>
									<div className="font-24 weight-500">250</div>
								</div>
								<div className="max-width-150">
									<div id="surgery-chart"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-lg-4 col-md-6 mb-20">
						<div className="card-box height-100-p pd-20 min-height-200px">
							<div className="d-flex justify-content-between pb-10">
								<div className="h5 mb-0">Top Doctors</div>
								<div className="dropdown">
									<a
										className="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle"
										data-color="#1b3133"
										href="#"
										role="button"
										data-toggle="dropdown"
									>
										<i className="dw dw-more"></i>
									</a>
									<div
										className="dropdown-menu dropdown-menu-right dropdown-menu-icon-list"
									>
										<a className="dropdown-item" href="#"
											><i className="dw dw-eye"></i> View</a
										>
										<a className="dropdown-item" href="#"
											><i className="dw dw-edit2"></i> Edit</a
										>
										<a className="dropdown-item" href="#"
											><i className="dw dw-delete-3"></i> Delete</a
										>
									</div>
								</div>
							</div>
							<div className="user-list">
								<ul>
									<li className="d-flex align-items-center justify-content-between">
										<div className="name-avatar d-flex align-items-center pr-2">
											<div className="avatar mr-2 flex-shrink-0">
												<img
													src="vendors/images/photo1.jpg"
													class="border-radius-100 box-shadow"
													width="50"
													height="50"
													alt=""
												/>
											</div>
											<div className="txt">
												<span
													className="badge badge-pill badge-sm"
													data-bgcolor="#e7ebf5"
													data-color="#265ed7"
													>4.9</span
												>
												<div className="font-14 weight-600">Dr. Neil Wagner</div>
												<div className="font-12 weight-500" data-color="#b2b1b6">
													Pediatrician
												</div>
											</div>
										</div>
										<div className="cta flex-shrink-0">
											<a href="#" className="btn btn-sm btn-outline-primary"
												>Schedule</a
											>
										</div>
									</li>
									<li className="d-flex align-items-center justify-content-between">
										<div className="name-avatar d-flex align-items-center pr-2">
											<div className="avatar mr-2 flex-shrink-0">
												<img
													src="vendors/images/photo2.jpg"
													className="border-radius-100 box-shadow"
													width="50"
													height="50"
													alt=""
												/>
											</div>
											<div className="txt">
												<span
													className="badge badge-pill badge-sm"
													data-bgcolor="#e7ebf5"
													data-color="#265ed7"
													>4.9</span
												>
												<div className="font-14 weight-600">Dr. Ren Delan</div>
												<div className="font-12 weight-500" data-color="#b2b1b6">
													Pediatrician
												</div>
											</div>
										</div>
										<div className="cta flex-shrink-0">
											<a href="#" className="btn btn-sm btn-outline-primary"
												>Schedule</a
											>
										</div>
									</li>
									<li className="d-flex align-items-center justify-content-between">
										<div className="name-avatar d-flex align-items-center pr-2">
											<div className="avatar mr-2 flex-shrink-0">
												<img
													src="vendors/images/photo3.jpg"
													className="border-radius-100 box-shadow"
													width="50"
													height="50"
													alt=""
												/>
											</div>
											<div className="txt">
												<span
													className="badge badge-pill badge-sm"
													data-bgcolor="#e7ebf5"
													data-color="#265ed7"
													>4.9</span
												>
												<div className="font-14 weight-600">Dr. Garrett Kincy</div>
												<div className="font-12 weight-500" data-color="#b2b1b6">
													Pediatrician
												</div>
											</div>
										</div>
										<div className="cta flex-shrink-0">
											<a href="#" className="btn btn-sm btn-outline-primary"
												>Schedule</a
											>
										</div>
									</li>
									<li className="d-flex align-items-center justify-content-between">
										<div className="name-avatar d-flex align-items-center pr-2">
											<div className="avatar mr-2 flex-shrink-0">
												<img
													src="vendors/images/photo4.jpg"
													className="border-radius-100 box-shadow"
													width="50"
													height="50"
													alt=""
												/>
											</div>
											<div className="txt">
												<span
													className="badge badge-pill badge-sm"
													data-bgcolor="#e7ebf5"
													data-color="#265ed7"
													>4.9</span
												>
												<div className="font-14 weight-600">Dr. Callie Reed</div>
												<div className="font-12 weight-500" data-color="#b2b1b6">
													Pediatrician
												</div>
											</div>
										</div>
										<div className="cta flex-shrink-0">
											<a href="#" class="btn btn-sm btn-outline-primary"
												>Schedule</a
											>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="col-lg-4 col-md-6 mb-20">
						<div className="card-box height-100-p pd-20 min-height-200px">
							<div className="d-flex justify-content-between">
								<div className="h5 mb-0">Diseases Report</div>
								<div className="dropdown">
									<a
										className="btn btn-link font-24 p-0 line-height-1 no-arrow dropdown-toggle"
										data-color="#1b3133"
										href="#"
										role="button"
										data-toggle="dropdown"
									>
										<i className="dw dw-more"></i>
									</a>
									<div
										className="dropdown-menu dropdown-menu-right dropdown-menu-icon-list"
									>
										<a className="dropdown-item" href="#"
											><i className="dw dw-eye"></i> View</a
										>
										<a className="dropdown-item" href="#"
											><i className="dw dw-edit2"></i> Edit</a
										>
										<a className="dropdown-item" href="#"
											><i className="dw dw-delete-3"></i> Delete</a
										>
									</div>
								</div>
							</div>

							<div id="diseases-chart"></div>
						</div>
					</div>
					<div className="col-lg-4 col-md-12 mb-20">
						<div className="card-box height-100-p pd-20 min-height-200px">
							<div className="max-width-300 mx-auto">
								<img src="vendors/images/upgrade.svg" alt="" />
							</div>
							<div className="text-center">
								<div className="h5 mb-1">Upgrade to Pro</div>
								<div
									className="font-14 weight-500 max-width-200 mx-auto pb-20"
									data-color="#a6a6a7"
								>
									You can enjoy all our features by upgrading to pro.
								</div>
								<a href="#" className="btn btn-primary btn-lg">Upgrade</a>
							</div>
						</div>
					</div>
				</div>

				<div className="card-box pb-10">
					<div className="h5 pd-20 mb-0">Recent Patient</div>
					<table className="data-table table nowrap">
						<thead>
							<tr>
								<th className="table-plus">Name</th>
								<th>Gender</th>
								<th>Weight</th>
								<th>Assigned Doctor</th>
								<th>Admit Date</th>
								<th>Disease</th>
								<th className="datatable-nosort">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo4.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Jennifer O. Oster</div>
										</div>
									</div>
								</td>
								<td>Female</td>
								<td>45 kg</td>
								<td>Dr. Callie Reed</td>
								<td>19 Oct 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Typhoid</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo5.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Doris L. Larson</div>
										</div>
									</div>
								</td>
								<td>Male</td>
								<td>76 kg</td>
								<td>Dr. Ren Delan</td>
								<td>22 Jul 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Dengue</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo6.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Joseph Powell</div>
										</div>
									</div>
								</td>
								<td>Male</td>
								<td>90 kg</td>
								<td>Dr. Allen Hannagan</td>
								<td>15 Nov 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Infection</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo9.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Jake Springer</div>
										</div>
									</div>
								</td>
								<td>Female</td>
								<td>45 kg</td>
								<td>Dr. Garrett Kincy</td>
								<td>08 Oct 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Covid 19</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo1.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Paul Buckland</div>
										</div>
									</div>
								</td>
								<td>Male</td>
								<td>76 kg</td>
								<td>Dr. Maxwell Soltes</td>
								<td>12 Dec 2020</td>
								<td>
									<span
										class="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Asthma</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo2.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Neil Arnold</div>
										</div>
									</div>
								</td>
								<td>Male</td>
								<td>60 kg</td>
								<td>Dr. Sebastian Tandon</td>
								<td>30 Oct 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Diabetes</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo8.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Christian Dyer</div>
										</div>
									</div>
								</td>
								<td>Male</td>
								<td>80 kg</td>
								<td>Dr. Sebastian Tandon</td>
								<td>15 Jun 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Diabetes</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
							<tr>
								<td className="table-plus">
									<div className="name-avatar d-flex align-items-center">
										<div className="avatar mr-2 flex-shrink-0">
											<img
												src="vendors/images/photo1.jpg"
												className="border-radius-100 shadow"
												width="40"
												height="40"
												alt=""
											/>
										</div>
										<div className="txt">
											<div className="weight-600">Doris L. Larson</div>
										</div>
									</div>
								</td>
								<td>Male</td>
								<td>76 kg</td>
								<td>Dr. Ren Delan</td>
								<td>22 Jul 2020</td>
								<td>
									<span
										className="badge badge-pill"
										data-bgcolor="#e7ebf5"
										data-color="#265ed7"
										>Dengue</span
									>
								</td>
								<td>
									<div className="table-actions">
										<a href="#" data-color="#265ed7"
											><i className="icon-copy dw dw-edit2"></i
										></a>
										<a href="#" data-color="#e95959"
											><i className="icon-copy dw dw-delete-3"></i
										></a>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="title pb-20 pt-20">
					<h2 className="h3 mb-0">Quick Start</h2>
				</div>

				<div className="row">
					<div claclassNamess="col-md-4 mb-20">
						<a href="#" className="card-box d-block mx-auto pd-20 text-secondary">
							<div className="img pb-30">
								<img src="vendors/images/medicine-bro.svg" alt="" />
							</div>
							<div className="content">
								<h3 className="h4">Services</h3>
								<p className="max-width-200">
									We provide superior health care in a compassionate maner
								</p>
							</div>
						</a>
					</div>
					<div className="col-md-4 mb-20">
						<a href="#" className="card-box d-block mx-auto pd-20 text-secondary">
							<div className="img pb-30">
								<img src="vendors/images/remedy-amico.svg" alt="" />
							</div>
							<div className="content">
								<h3 className="h4">Medications</h3>
								<p className="max-width-200">
									Look for prescription and over-the-counter drug information.
								</p>
							</div>
						</a>
					</div>
					<div className="col-md-4 mb-20">
						<a href="#" className="card-box d-block mx-auto pd-20 text-secondary">
							<div className="img pb-30">
								<img src="vendors/images/paper-map-cuate.svg" alt="" />
							</div>
							<div className="content">
								<h3 className="h4">Locations</h3>
								<p className="max-width-200">
									Convenient locations when and where you need them.
								</p>
							</div>
						</a>
					</div>
				</div>

				<div className="footer-wrap pd-20 mb-20 card-box">
					DeskApp - Bootstrap 4 Admin Template By
					<a href="https://github.com/dropways" target="_blank"
						>Ankit Hingarajiya</a
					>
				</div>
			</div>
		</div>

		<div className="welcome-modal">
			<button className="welcome-modal-close">
				<i className="bi bi-x-lg"></i>
			</button>
			<iframe
				className="w-100 border-0"
				src="https://embed.lottiefiles.com/animation/31548"
			></iframe>
			<div className="text-center">
				<h3 className="h5 weight-500 text-center mb-2">
					Open source
					<span role="img" aria-label="gratitude">❤️</span>
				</h3>
				<div className="pb-2">
					<a
						className="github-button"
						href="https://github.com/dropways/deskapp"
						data-color-scheme="no-preference: dark; light: light; dark: light;"
						data-icon="octicon-star"
						data-size="large"
						data-show-count="true"
						aria-label="Star dropways/deskapp dashboard on GitHub"
						>Star</a
					>
					<a
						className="github-button"
						href="https://github.com/dropways/deskapp/fork"
						data-color-scheme="no-preference: dark; light: light; dark: light;"
						data-icon="octicon-repo-forked"
						data-size="large"
						data-show-count="true"
						aria-label="Fork dropways/deskapp dashboard on GitHub"
						>Fork</a
					>
				</div>
			</div>
			<div className="text-center mb-1">
				<div>
					<a
						href="https://github.com/dropways/deskapp"
						target="_blank"
						className="btn btn-light btn-block btn-sm"
					>
						<span className="text-danger weight-600">STAR US</span>
						<span className="weight-600">ON GITHUB</span>
						<i class="fa fa-github"></i>
					</a>
				</div>
				<script
					async
					defer="defer"
					src="https://buttons.github.io/buttons.js"
				></script>
			</div>
			<a
				href="https://github.com/dropways/deskapp"
				target="_blank"
				className="btn btn-success btn-sm mb-0 mb-md-3 w-100"
			>
				DOWNLOAD
				<i className="fa fa-download"></i>
			</a>
			<p className="font-14 text-center mb-1 d-none d-md-block">
				Available in the following technologies:
			</p>
			<div className="d-none d-md-flex justify-content-center h1 mb-0 text-danger">
				<i className="fa fa-html5"></i>
			</div>
		</div>




</>

	)
}

export default Home;




