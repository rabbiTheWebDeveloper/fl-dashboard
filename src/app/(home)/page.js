import Theme from "./_component/Theme";


const page = () => {
  return (
   <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AMARDokan - E-commerce Automation | Bangladesh's #1 Solution</title>
  <meta
    name="description"
    content="Bangladesh's #1 e-commerce automation platform for bulk invoice printing, order management, and business reporting. Automate your e-commerce business today."
  />
  <meta
    name="keywords"
    content="e-commerce automation, bulk invoice print, Bangladesh e-commerce, order management, stock tracking, Daraz automation"
  />
  <meta
    property="og:title"
    content="AMARDokan - E-commerce Automation Platform"
  />
  <meta
    property="og:description"
    content="Automate your e-commerce business with Bangladesh's #1 solution"
  />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://AMARDokan.com" />
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n    body {\n      background: #0f0a1a;\n      color: #ffffff;\n      font-family: system-ui, -apple-system, sans-serif;\n      overflow-x: hidden;\n    }\n    .gradient-text {\n      background: linear-gradient(135deg, #8b5cf6, #06b6d4);\n      -webkit-background-clip: text;\n      -webkit-text-fill-color: transparent;\n      background-clip: text;\n    }\n    .gradient-cta {\n      background: linear-gradient(135deg, #8b5cf6, #a855f7);\n    }\n    .blob-purple {\n      background: rgba(139, 92, 246, 0.3);\n    }\n    .blob-teal {\n      background: rgba(6, 182, 212, 0.3);\n    }\n    .icon-box {\n      width: 48px;\n      height: 48px;\n      border-radius: 12px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .icon-box-purple { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }\n    .icon-box-orange { background: rgba(251, 146, 60, 0.15); color: #fb923c; }\n    .icon-box-teal { background: rgba(6, 182, 212, 0.15); color: #06b6d4; }\n    .icon-box-pink { background: rgba(236, 72, 153, 0.15); color: #ec4899; }\n    .icon-box-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }\n    .icon-box-green { background: rgba(34, 197, 94, 0.15); color: #22c55e; }\n    .hover-lift {\n      transition: transform 0.2s, box-shadow 0.2s;\n    }\n    .hover-lift:hover {\n      transform: translateY(-4px);\n      box-shadow: 0 10px 40px rgba(139, 92, 246, 0.2);\n    }\n    .btn-hero {\n      background: linear-gradient(135deg, #8b5cf6, #a855f7);\n      color: white;\n      padding: 12px 24px;\n      border-radius: 12px;\n      font-weight: 600;\n      display: inline-flex;\n      align-items: center;\n      gap: 8px;\n      transition: all 0.2s;\n    }\n    .btn-hero:hover {\n      box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);\n      transform: translateY(-2px);\n    }\n    .btn-outline {\n      border: 1px solid rgba(139, 92, 246, 0.3);\n      background: transparent;\n      color: white;\n      padding: 12px 24px;\n      border-radius: 12px;\n      font-weight: 600;\n      display: inline-flex;\n      align-items: center;\n      gap: 8px;\n      transition: all 0.2s;\n    }\n    .btn-outline:hover {\n      background: rgba(139, 92, 246, 0.1);\n      border-color: rgba(139, 92, 246, 0.5);\n    }\n    .rotate-180 {\n      transform: rotate(180deg);\n      transition: transform 0.3s;\n    }\n    .mobile-menu {\n      transition: all 0.3s ease;\n    }\n    .mobile-menu.hidden {\n      opacity: 0;\n      transform: translateY(-10px);\n      pointer-events: none;\n    }\n    .mobile-menu.active {\n      opacity: 1;\n      transform: translateY(0);\n    }\n    @keyframes fadeIn {\n      from { opacity: 0; transform: translateY(20px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n    .fade-in {\n      animation: fadeIn 0.6s ease forwards;\n    }\n  "
    }}
  />
  {/* Navbar */}
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0a1a]/95 backdrop-blur-sm">
    <div className="container mx-auto px-6 flex items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-cta flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">আ</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white leading-tight">
            AMARDokan
          </span>
          <span className="text-xs text-gray-400 leading-tight">
            E-commerce Automation
          </span>
        </div>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#problems"
          className="text-sm font-medium text-gray-400 hover:text-white transition hover:scale-105"
        >
          Problems
        </a>
        <a
          href="#features"
          className="text-sm font-medium text-gray-400 hover:text-white transition hover:scale-105"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-sm font-medium text-gray-400 hover:text-white transition hover:scale-105"
        >
          Pricing
        </a>
        <a
          href="#reviews"
          className="text-sm font-medium text-gray-400 hover:text-white transition hover:scale-105"
        >
          Reviews
        </a>
        <a
          href="#faq"
          className="text-sm font-medium text-gray-400 hover:text-white transition hover:scale-105"
        >
          FAQ
        </a>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <button
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition hover:scale-105"
          id="language-switcher"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx={12} cy={12} r={10} />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span id="language-text">BN</span>
        </button>
        <button className="btn-hero" onclick="scrollToContact()">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contact Us
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-400 hover:text-white transition"
        id="mobile-menu-button"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
    {/* Mobile Menu */}
    <div
      className="mobile-menu md:hidden absolute top-16 left-0 right-0 bg-[#0f0a1a] border-t border-gray-800 py-4 px-6 hidden"
      id="mobile-menu"
    >
      <div className="flex flex-col space-y-4">
        <a
          href="#problems"
          className="text-sm font-medium text-gray-400 hover:text-white transition py-2"
        >
          Problems
        </a>
        <a
          href="#features"
          className="text-sm font-medium text-gray-400 hover:text-white transition py-2"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-sm font-medium text-gray-400 hover:text-white transition py-2"
        >
          Pricing
        </a>
        <a
          href="#reviews"
          className="text-sm font-medium text-gray-400 hover:text-white transition py-2"
        >
          Reviews
        </a>
        <a
          href="#faq"
          className="text-sm font-medium text-gray-400 hover:text-white transition py-2"
        >
          FAQ
        </a>
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <button
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
            id="mobile-language-switcher"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span id="mobile-language-text">বাংলা / English</span>
          </button>
          <button className="btn-hero text-sm" onclick="scrollToContact()">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  </nav>
  {/* Hero Section */}
  <section className="relative pt-32 pb-20 overflow-hidden">
    <div className="absolute top-20 -left-40 w-96 h-96 blob-purple rounded-full blur-3xl opacity-60" />
    <div className="absolute top-40 -right-40 w-80 h-80 blob-teal rounded-full blur-3xl opacity-50" />
    <div className="container mx-auto px-6 relative z-10 fade-in">
      {/* Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
          <svg
            className="w-4 h-4 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm font-medium text-purple-400">
            #1 E-commerce Solution in Bangladesh
          </span>
        </div>
      </div>
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Your E-commerce Business
          <br />
          <span className="gradient-text">Bulk Invoice Print</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Order management, stock tracking, courier integration, and business
          reporting — all automated in one platform
        </p>
      </div>
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <button className="btn-hero" onclick="scrollToContact()">
          Schedule a Demo
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
        <button className="btn-outline" onclick="openVideoDemo()">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Watch Demo
        </button>
      </div>
      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-12">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          5-minute setup
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          2000+ Businesses
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          24/7 Support
        </div>
      </div>
      {/* Stats */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-8 md:gap-12 px-8 py-6 bg-[#1a1625] rounded-2xl shadow-xl border border-purple-500/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span
                className="text-2xl md:text-3xl font-bold text-white"
                id="user-count"
              >
                1000+
              </span>
            </div>
            <span className="text-sm text-gray-400">Users</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span
                className="text-2xl md:text-3xl font-bold text-white"
                id="order-count"
              >
                5M+
              </span>
            </div>
            <span className="text-sm text-gray-400">Orders</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span
                className="text-2xl md:text-3xl font-bold text-white"
                id="success-rate"
              >
                98%
              </span>
            </div>
            <span className="text-sm text-gray-400">Success</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* Integration Logos */}
  <section className="py-16 bg-[#1a1625] fade-in">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <p className="text-gray-400 mb-8">
          Trusted by 2000+ businesses integrated with
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-80">
          <div className="text-2xl font-bold text-white">Daraz</div>
          <div className="text-2xl font-bold text-blue-500">Shopify</div>
          <div className="text-2xl font-bold text-purple-600">WooCommerce</div>
          <div className="text-2xl font-bold text-green-600">Pathao</div>
          <div className="text-2xl font-bold text-red-500">Redx</div>
          <div className="text-2xl font-bold text-orange-500">eCourier</div>
        </div>
      </div>
    </div>
  </section>
  {/* Problems Section */}
  <section id="problems" className="py-20 bg-[#1a1625] fade-in">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-4">
          Common Problems
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Challenges You Face Daily
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          These are the real issues that cost you time, money, and customers
          every single day
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Problem Card 1 */}
        <div className="p-6 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-purple mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Profit-Loss Tracking
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Business is running, but you don't know if you're making profit. Who
            keeps track of all this manually!
          </p>
        </div>
        {/* Problem Card 2 */}
        <div className="p-6 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-orange mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Budget Wasted on Fake Orders
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Pixel health is down and fake orders drain your ad budget without
            real sales.
          </p>
        </div>
        {/* Problem Card 3 */}
        <div className="p-6 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-teal mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Return Parcel Issues
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            No tracking of return parcels, yet losing one parcel means minus
            profit from 10 sales.
          </p>
        </div>
        {/* Problem Card 4 */}
        <div className="p-6 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-pink mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Stock Management
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            No inventory tracking, product not available when orders come in.
          </p>
        </div>
        {/* Problem Card 5 */}
        <div className="p-6 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-blue mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Team Management Problems
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Struggling with team management. Hard to tell who's working, who's
            slacking.
          </p>
        </div>
        {/* Problem Card 6 */}
        <div className="p-6 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-green mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Data Analysis
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Can't figure out which product is profitable and which is losing
            money.
          </p>
        </div>
      </div>
    </div>
  </section>
  {/* Features Section */}
  <section id="features" className="py-20 relative overflow-hidden fade-in">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blob-purple rounded-full blur-3xl opacity-30" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
          Powerful Features
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          All features and
          <br />
          <span className="gradient-text">automation in one platform</span>
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          All the tools you need to manage your e-commerce business efficiently
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Feature Card 1 */}
        <div className="p-6 bg-[#1a1625] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-teal mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Incomplete Order Tracking
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Keep customers on order forms to complete purchases every time
            quickly.
          </p>
        </div>
        {/* Feature Card 2 */}
        <div className="p-6 bg-[#1a1625] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-purple mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Fake Order Prevention
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Block duplicate orders, Checkout OTP, and return customer
            identification.
          </p>
        </div>
        {/* Feature Card 3 */}
        <div className="p-6 bg-[#1a1625] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-blue mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Return Order Tracking
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Keep track of whether courier companies are returning all parcels
            properly.
          </p>
        </div>
        {/* Feature Card 4 */}
        <div className="p-6 bg-[#1a1625] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-orange mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Do More in Less Time
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Save massive amounts of time by automating your e-commerce tasks.
          </p>
        </div>
        {/* Feature Card 5 */}
        <div className="p-6 bg-[#1a1625] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-pink mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Detailed Reporting
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Get comprehensive reports on sales, profits, and business
            performance.
          </p>
        </div>
        {/* Feature Card 6 */}
        <div className="p-6 bg-[#1a1625] rounded-2xl border border-purple-500/20 hover-lift cursor-pointer">
          <div className="icon-box icon-box-green mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Employee Performance
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Track and measure your team's productivity and performance metrics.
          </p>
        </div>
      </div>
      <div className="text-center">
        <button className="btn-hero" onclick="scrollToContact()">
          See All Features
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
  {/* Pricing Section */}
  <section id="pricing" className="py-20 bg-[#0f0a1a] fade-in">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
          Pricing Plans
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Start free, upgrade as you grow
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-[#1a1625] rounded-2xl p-8 border border-gray-800 hover:border-purple-500 transition-all duration-300 hover-lift">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-white">Free</span>
              <span className="text-gray-400 ml-2">/forever</span>
            </div>
            <p className="text-gray-400 text-sm">
              For small businesses just starting out
            </p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Up to 100 orders/month
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Basic analytics
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Email support
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              1 User account
            </li>
          </ul>
          <button
            className="w-full py-3 px-4 rounded-xl border border-gray-700 text-white hover:bg-gray-800 transition"
            onclick="selectPlan('starter')"
          >
            Get Started Free
          </button>
        </div>
        {/* Pro Plan */}
        <div className="bg-gradient-to-b from-purple-500/20 to-transparent rounded-2xl p-8 border-2 border-purple-500 relative hover-lift">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </span>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-white">৳2,999</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <p className="text-gray-300 text-sm">
              For growing e-commerce businesses
            </p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Up to 5,000 orders/month
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Advanced analytics
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Priority support
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              API access
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Up to 5 User accounts
            </li>
          </ul>
          <button
            className="w-full py-3 px-4 rounded-xl gradient-cta text-white font-medium hover:opacity-90 transition"
            onclick="selectPlan('pro')"
          >
            Start 14-Day Trial
          </button>
        </div>
        {/* Enterprise Plan */}
        <div className="bg-[#1a1625] rounded-2xl p-8 border border-gray-800 hover:border-purple-500 transition-all duration-300 hover-lift">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
            <div className="flex items-baseline mb-4">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <p className="text-gray-400 text-sm">For large-scale operations</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited orders
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Custom integrations
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Dedicated account manager
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              SLA guarantee
            </li>
            <li className="flex items-center text-gray-300">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited users
            </li>
          </ul>
          <button
            className="w-full py-3 px-4 rounded-xl border border-purple-500 text-white hover:bg-purple-500/10 transition"
            onclick="selectPlan('enterprise')"
          >
            Contact Sales
          </button>
        </div>
      </div>
      <div className="text-center mt-12">
        <p className="text-gray-400 text-sm">
          All plans include: 7-day money back guarantee • 24/7 support • Regular
          updates
        </p>
      </div>
    </div>
  </section>
  {/* Testimonials Section */}
  <section id="reviews" className="py-20 bg-[#1a1625] overflow-hidden fade-in">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
          Customer Reviews
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          What our clients
          <br />
          <span className="gradient-text">are saying?</span>
        </h2>
        <p className="text-gray-400">
          1000+ satisfied business owners use AMARDokan
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Testimonial Card */}
        <div className="p-5 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift">
          <div className="flex gap-0.5 mb-3">
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-sm text-white mb-4 leading-relaxed">
            "AMARDokan has completely changed the way I run my e-commerce
            business. The automation saves me hours every day!"
          </p>
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Rahim"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">Rahim</p>
              <p className="text-xs text-gray-400">@rahim_fashion</p>
            </div>
          </div>
        </div>
        {/* Testimonial Card 2 */}
        <div className="p-5 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift">
          <div className="flex gap-0.5 mb-3">
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-sm text-white mb-4 leading-relaxed">
            "The fake order prevention feature alone has saved me thousands.
            Best investment for my business!"
          </p>
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
              alt="Afrin"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">Afrin</p>
              <p className="text-xs text-gray-400">@afrin_fashion</p>
            </div>
          </div>
        </div>
        {/* Testimonial Card 3 */}
        <div className="p-5 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift">
          <div className="flex gap-0.5 mb-3">
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-sm text-white mb-4 leading-relaxed">
            "AMARDokan is a game changer! I can now follow up with customers and
            recover lost sales efficiently."
          </p>
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Rifat"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">Rifat</p>
              <p className="text-xs text-gray-400">@rifat_bd</p>
            </div>
          </div>
        </div>
        {/* Testimonial Card 4 */}
        <div className="p-5 bg-[#0f0a1a] rounded-2xl border border-purple-500/20 hover-lift">
          <div className="flex gap-0.5 mb-3">
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="text-sm text-white mb-4 leading-relaxed">
            "Finally found a complete solution for my business. The reporting
            features are incredibly detailed."
          </p>
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
              alt="Sumon"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">Sumon</p>
              <p className="text-xs text-gray-400">@sumon_store</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* FAQ Section */}
  <section id="faq" className="py-20 bg-[#1a1625] fade-in">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
          FAQ
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Get answers to common questions about AMARDokan
        </p>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          <div className="faq-item bg-[#0f0a1a] rounded-xl p-6 border border-gray-800">
            <button
              className="flex justify-between items-center w-full text-left"
              onclick="toggleFAQ(this)"
            >
              <span className="text-lg font-medium text-white">
                How long does setup take?
              </span>
              <svg
                className="w-5 h-5 text-purple-400 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="faq-answer mt-4 hidden">
              <p className="text-gray-400">
                Setup takes less than 5 minutes. Simply connect your e-commerce
                platform, and you're ready to go. No technical knowledge
                required.
              </p>
            </div>
          </div>
          <div className="faq-item bg-[#0f0a1a] rounded-xl p-6 border border-gray-800">
            <button
              className="flex justify-between items-center w-full text-left"
              onclick="toggleFAQ(this)"
            >
              <span className="text-lg font-medium text-white">
                Which platforms do you integrate with?
              </span>
              <svg
                className="w-5 h-5 text-purple-400 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="faq-answer mt-4 hidden">
              <p className="text-gray-400">
                We integrate with all major platforms including Daraz, Shopify,
                WooCommerce, and custom websites through our API. We also
                integrate with all major Bangladeshi courier services.
              </p>
            </div>
          </div>
          <div className="faq-item bg-[#0f0a1a] rounded-xl p-6 border border-gray-800">
            <button
              className="flex justify-between items-center w-full text-left"
              onclick="toggleFAQ(this)"
            >
              <span className="text-lg font-medium text-white">
                Is there a free trial?
              </span>
              <svg
                className="w-5 h-5 text-purple-400 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="faq-answer mt-4 hidden">
              <p className="text-gray-400">
                Yes! We offer a 14-day free trial for our Pro plan. You can also
                use our Starter plan for free forever with limited features.
              </p>
            </div>
          </div>
          <div className="faq-item bg-[#0f0a1a] rounded-xl p-6 border border-gray-800">
            <button
              className="flex justify-between items-center w-full text-left"
              onclick="toggleFAQ(this)"
            >
              <span className="text-lg font-medium text-white">
                Do you offer training and support?
              </span>
              <svg
                className="w-5 h-5 text-purple-400 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="faq-answer mt-4 hidden">
              <p className="text-gray-400">
                Yes! We provide comprehensive onboarding, video tutorials, and
                24/7 support via WhatsApp and email. Enterprise customers get
                dedicated account managers.
              </p>
            </div>
          </div>
          <div className="faq-item bg-[#0f0a1a] rounded-xl p-6 border border-gray-800">
            <button
              className="flex justify-between items-center w-full text-left"
              onclick="toggleFAQ(this)"
            >
              <span className="text-lg font-medium text-white">
                Can I cancel anytime?
              </span>
              <svg
                className="w-5 h-5 text-purple-400 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="faq-answer mt-4 hidden">
              <p className="text-gray-400">
                Absolutely! You can cancel your subscription at any time. We
                also offer a 7-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* CTA Section */}
  <section className="py-20 gradient-cta relative overflow-hidden">
    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
    <div className="container mx-auto px-6 relative z-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Start your e-commerce journey today!
      </h2>
      <p className="text-white/80 mb-8 max-w-xl mx-auto">
        Get a free demo and see how AMARDokan can transform your business
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          className="btn-outline bg-[#1a1625] text-white border-0 hover:bg-[#1a1625]/90 px-8 py-4 text-lg"
          onclick="scrollToContact()"
        >
          Schedule a Demo
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
        <button
          className="btn-hero px-8 py-4 text-lg"
          onclick="selectPlan('pro')"
        >
          Start Free Trial
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
  {/* Footer */}
  <footer className="bg-[#1a1625] text-white py-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
              <span className="text-white font-bold text-sm">আ</span>
            </div>
            <span className="text-xl font-bold">
              AMAR<span className="text-purple-400">Dokan</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Bangladesh's most complete e-commerce management solution. Automate
            your business today.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-purple-500 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <a
                href="#problems"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Problems
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#reviews"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Video Tutorials
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                API Docs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Help Center
              </a>
            </li>
          </ul>
        </div>
        {/* Contact */}
        <div className="lg:col-span-1">
          <h4 className="font-semibold mb-4">Contact</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">WhatsApp</p>
                <p className="text-sm font-medium">+880 1234-567890</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-sm font-medium">+880 1234-567891</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-sm font-medium">support@AMARDokan.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © 2025 AMARDokan. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition">
            Cookie Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
  {/* Floating WhatsApp Chat */}
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
    <div
      className="flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
      onclick="openWhatsApp()"
    >
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </div>
      <div className="text-sm">
        <p className="font-semibold">Need help?</p>
        <p className="text-white/80 text-xs">We're online</p>
      </div>
    </div>
  </div>
  convert one component this html
</>

  );
};

export default page;