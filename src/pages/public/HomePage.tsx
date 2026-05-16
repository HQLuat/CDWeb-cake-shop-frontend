import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCakeCandles } from "@fortawesome/free-solid-svg-icons";
import {
  yummy,
  bake1,
  bake2,
  chocolateFudgeTruffleCheesecake,
  simpleValentineDayCupcakesRecipeCelebrateLoveDeliciously,
  vanillaCupcakeswithSweetButtercreamFrosting,
} from "../../assets/homePage";
import headerCream from "../../assets/homePage/header/theProminentOrganicDrippingCreamMaskTransitionMask.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="mt-20">
      {/* Banner */}
      <section className="relative pt-20 pb-30 bg-primary text-white overflow-visible">
        <img src={headerCream} className="w-full h-70 absolute top-0 left-0" />
        <div className="max-w-300 mx-auto px-5 relative flex items-center justify-between z-2">
          {/* Left part */}
          <div className="w-[40%]">
            <span className="text-[12px] uppercase tracking-[2px] mb-3.75 block text-text-secondary">
              Boutique Patisserie
            </span>
            <h1 className="font-lora font-medium text-[54px] leading-[1.1] mb-5">
              Handcrafted Moments
            </h1>
            <p className="text-[15px] mb-7.5 opacity-90">
              Nâng tầm nghệ thuật làm bánh qua sự thuần khiết từ nguyên liệu hữu cơ và hương vị di sản. Hãy trải nghiệm kết cấu mềm mịn như nhung từ những bậc thầy thủ công thực thụ.
            </p>
            <div className="flex gap-3.75">
              <button className="bg-white text-text-dark px-6 py-3 rounded-[30px] text-[13px] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-300">
                Shop Now
              </button>
              <button className="bg-transparent text-white border border-solid border-white px-6 py-3 rounded-[30px] text-[13px] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-300">
                Our Story
              </button>
            </div>
          </div>
          {/* Right part */}
          <div className="w-[40%] relative">
            <img
              src={yummy}
              alt="Chocolate Cake"
              className="w-full h-145 relative rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] rotate-3 z-2"
            />
            <div className="py-3.75 px-6.25 absolute -bottom-5 -left-10 bg-white text-text-dark rounded-[10px] shadow-[0_10px_20px_rgba(0,0,0,0.1)] -rotate-3 z-3">
              <h4 className="font-lora text-primary text-[18px]">
                Freshly Baked
              </h4>
              <p className="mt-1.25 text-[10px] uppercase tracking-[1px] opacity-90">
                Every morning at 6 AM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-bg-main">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="font-lora text-[32px] text-primary">Browse by Category</h2>
            <p className="text-text-light text-[14px] mt-2">Khám phá bộ sưu tập bánh thủ công tinh tế của chúng tôi</p>
          </div>
          
          <div className="flex justify-center flex-wrap gap-8 md:gap-12">
            {/* Category Item */}
            {[
              { name: "Cakes", icon: "🎂", count: "12 Items" },
              { name: "Sourdough", icon: "🥖", count: "8 Items" },
              { name: "Macarons", icon: "🍪", count: "15 Items" },
              { name: "Cupcakes", icon: "🧁", count: "10 Items" },
              { name: "Pastries", icon: "🥐", count: "9 Items" },
              { name: "Red Velvet", icon: "🍰", count: "5 Items" },
            ].map((cat, index) => (
              <div 
                key={index} 
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md flex items-center justify-center text-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2">
                  {cat.icon}
                </div>
                <h4 className="mt-4 font-lora font-semibold text-[16px] text-text-dark group-hover:text-primary transition-colors">
                  {cat.name}
                </h4>
                <span className="text-[11px] uppercase tracking-wider text-text-light opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-25">
        <div className="max-w-300 m-auto px-5 flex justify-between">
          {/* Features title */}
          <div className="w-[30%]">
            <h2 className="font-lora text-[32px] text-primary mb-5">
              The Artisan
              <br />
              Promise
            </h2>
            <hr className="w-12.5 h-0.5 bg-primary border-none" />
          </div>
          {/* Features list */}
          <div className="w-[60%] flex gap-10">
            <div>
              <FontAwesomeIcon icon={faStar} />
              <h3 className="mt-3.75 mb-2.5 font-lora text-[20px]">
                Quality Ingredients
              </h3>
              <p className="text-[14px] text-text-light">
                Chúng tôi chỉ sử dụng bơ hữu cơ AOP từ Pháp và socola nguyên bản (single-origin) để tạo nên chiều sâu hương vị đặc trưng cho thương hiệu
              </p>
            </div>
            <div>
              <FontAwesomeIcon icon={faCakeCandles} />
              <h3 className="mt-3.75 mb-2.5 font-lora text-[20px]">
                Fresh Daily Baking
              </h3>
              <p className="text-[14px] text-text-light">
                Lò nướng của chúng tôi chưa bao giờ nghỉ. Mỗi chiếc bánh sừng bò đều được cán tay thủ công và nướng chín vàng hoàn hảo ngay trước giờ mở cửa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="pt-12.5 pb-25 bg-white">
        <div className="max-w-300 m-auto px-5">
          {/* Section header */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <span className="mb-3.75 block text-primary text-[12px] uppercase tracking-[2px]">
                The Signature Collection
              </span>
              <h2 className="font-lora text-[36px]">Featured Delicacies</h2>
            </div>
            <a
              href="#"
              className="text-primary text-[14px] font-medium underline underline-offset-4"
            >
              View All Menu →
            </a>
          </div>
          {/* Product grid */}
          <div className="grid grid-cols-[repeat(3,1fr)] gap-6.25">
            <div className="col-span-2 flex-row bg-bg-surface rounded-[15px] overflow-hidden flex">
              <div className="w-[40%] p-10 flex flex-col justify-center grow bg-bg-main">
                <div className="mb-2.5 flex justify-between">
                  <h3 className="font-lora text-[18px] font-semibold">
                    The Signature
                    <br />
                    Sourdough
                  </h3>
                  <span className="text-primary font-semibold">$12</span>
                </div>
                <p className="mb-5 text-[13px] text-text-light grow">
                  72-hour fermentation process using our heritage starter,
                  yielding a complex tang and perfectly charred crust.
                </p>
                 <Link 
                  to="/product/sourdough-01" 
                  className="bg-primary text-white text-center w-full p-2.5 rounded-[20px] border border-solid border-primary text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition duration-300 hover:bg-white hover:text-primary">
                 View Selection
                </Link>
              </div>
              <div className="w-[60%] h-full bg-white">
                <img src={bake1} alt="Sourdough" className="w-full h-100" />
              </div>
            </div>
            <div className="bg-bg-surface rounded-[15px] overflow-hidden flex flex-col">
              <div className="h-50 bg-white">
                <img
                  src={bake2}
                  alt="Bake 2"
                  className="transform-[translateY(-30%)] z-0"
                />
              </div>
              <div className="p-5 flex flex-col grow bg-bg-main z-1">
                <div className="flex justify-between mb-2.5">
                  <h3 className="font-lora text-[18px] font-semibold">
                    Strawberry Macaron
                  </h3>
                  <span className="text-primary font-semibold">$6.50</span>
                </div>
                <p className="text-[13px] text-text-light mb-5 grow">
                  Twice-baked with premium almond frangipane.
                </p>
                 <Link 
                  to="/product/sourdough-01" 
                  className="bg-primary text-white text-center w-full p-2.5 rounded-[20px] border border-solid border-primary text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition duration-300 hover:bg-white hover:text-primary">
                 View Selection
                </Link>
              </div>
            </div>
            <div className="bg-bg-surface rounded-[15px] overflow-hidden flex flex-col">
              <div className="h-50 bg-white">
                <img
                  src={chocolateFudgeTruffleCheesecake}
                  alt="Chocolate Fudge Truffle Cheesecake"
                  className="transform-[translateY(-10%)] z-0"
                />
              </div>
              <div className="px-5 py-10 flex flex-col grow bg-bg-main z-1">
                <div className="flex justify-between mb-10">
                  <h3 className="font-lora text-[18px] font-semibold">
                    Chocolate Fudge Cheesecake
                  </h3>
                  <span className="text-primary font-semibold">$4.00</span>
                </div>
                <Link 
                  to="/product/sourdough-01" 
                  className="bg-primary text-white text-center w-full p-2.5 rounded-[20px] border border-solid border-primary text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition duration-300 hover:bg-white hover:text-primary">
                 View Selection
                </Link>
              </div>
            </div>
            <div className="bg-bg-surface rounded-[15px] overflow-hidden flex flex-col">
              <div className="h-50 bg-white">
                <img
                  src={simpleValentineDayCupcakesRecipeCelebrateLoveDeliciously}
                  alt="Simple Valentine Day Cupcakes Recipe Celebrate Love Deliciously"
                  className="transform-[translateY(-20%)] z-0"
                />
              </div>
              <div className="py-10 px-5 flex flex-col grow bg-bg-main z-1">
                <div className="flex justify-between mb-10">
                  <h3 className="font-lora text-[18px] font-semibold">
                    Valentine Cupcakes
                  </h3>
                  <span className="text-primary font-semibold">$8.00</span>
                </div>
                <Link 
                  to="/product/sourdough-01" 
                  className="bg-primary text-white text-center w-full p-2.5 rounded-[20px] border border-solid border-primary text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition duration-300 hover:bg-white hover:text-primary">
                 View Selection
                </Link>
              </div>
            </div>
            <div className="bg-bg-surface rounded-[15px] overflow-hidden flex flex-col">
              <div className="h-50 bg-white">
                <img
                  src={vanillaCupcakeswithSweetButtercreamFrosting}
                  alt="Vanilla Cupcakes with Sweet Butter cream Frosting"
                  className="transform-[translateY(-20%)] z-0"
                />
              </div>
              <div className="py-10 px-5 flex flex-col grow bg-bg-main z-1">
                <div className="flex justify-between mb-10">
                  <h3 className="font-lora text-[18px] font-semibold">
                    Vanilla Cupcakes
                  </h3>
                  <span className="text-primary font-semibold">$24.00</span>
                </div>
                <Link 
                  to="/product/sourdough-01" 
                  className="bg-primary text-white text-center w-full p-2.5 rounded-[20px] border border-solid border-primary text-[12px] font-semibold uppercase tracking-[1px] cursor-pointer transition duration-300 hover:bg-white hover:text-primary">
                 View Selection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  ARTISAN PROCESS */}
        <section className="py-20 bg-bg-main overflow-hidden">
          <div className="max-w-300 mx-auto px-5">
            <div className="flex flex-col md:flex-row items-center gap-15">
              <div className="w-full md:w-1/2 relative">
                <div className="grid grid-cols-2 gap-4">
                  <img src={bake1} alt="Process 1" className="rounded-2xl mt-8 shadow-lg" />
                  <img src={bake2} alt="Process 2" className="rounded-2xl shadow-lg" />
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
              
              <div className="w-full md:w-1/2">
                <span className="text-primary font-medium uppercase tracking-[2px] text-[12px]">Our Secret</span>
                <h2 className="font-lora text-[40px] leading-tight mt-4 mb-6">Meticulously Crafted <br/> From Grain to Crust</h2>
                <p className="text-text-light text-[15px] mb-8 leading-relaxed">
                  Chúng tôi không chỉ làm bánh, chúng tôi tạo ra những trải nghiệm. Mỗi mẻ bánh Red Velvet tại <strong>Velvet Muse</strong> đều tuân thủ quy trình ủ lạnh 24h để đạt được kết cấu nhung mịn hoàn hảo mà không tiệm bánh công nghiệp nào có được.
                </p>
                <ul className="space-y-4">
                  {['100% Organic Ingredients', 'Traditional Slow-Fermentation', 'Hand-laminated Layers'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] font-medium">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/*TESTIMONIALS */}
        <section className="py-20 bg-white">
          <div className="max-w-300 mx-auto px-5 text-center">
            <h2 className="font-lora text-[32px] mb-12 text-primary text-center">Loved by Dessert Enthusiasts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {name: "Sophia Chen", comment: "Bánh Red Velvet ở đây thực sự là cực phẩm! Lớp kem cheese không quá ngọt, mịn như lụa."},
                {name: "James Wilson", comment: "Sourdough giòn tan bên ngoài nhưng dai mềm bên trong. Hương vị lên men rất sâu sắc."},
                {name: "Elena Tran", comment: "Không gian tiệm thơ mộng và bánh thì luôn tươi mới mỗi sáng. Rất đáng trải nghiệm!"}
              ].map((review, i) => (
                <div key={i} className="p-8 rounded-2xl bg-bg-surface border border-gray-50 hover:shadow-xl transition-shadow">
                  <div className="text-yellow-500 mb-4">★★★★★</div>
                  <p className="italic text-text-light text-[14px] mb-6">"{review.comment}"</p>
                  <div className="font-semibold text-primary">— {review.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Newsletter */}
      <section className="pb-25 bg-white">
        <div className="max-w-300 m-auto px-5">
          <div className="bg-primary rounded-[20px] py-15 px-5 text-center text-white relative overflow-hidden before:content-[''] before:absolute before:-bottom-12.5 before:-left-12.5 before:w-50 before:h-50 before:bg-[rgba(255,255,255,0.05)] before:rounded-[50%] after:content-[''] after:absolute after:-top-12.5 after:-right-12.5 after:w-50 after:h-50 after:bg-[rgba(255,255,255,0.05)] after:rounded-[50%]">
            <h2 className="font-lora text-[36px] mb-3.75">
              Join the Velvet Muse
            </h2>
            <p className="text-[14px] opacity-[0.8] max-w-125 mx-auto mb-7.5 ">
              Subscribe to receive exclusive seasonal menus, baking secrets from
              our chef, and invitations to our monthly tasting events.
            </p>
            <form className="flex justify-center gap-2.5 max-w-100 mx-auto">
              <input
                type="email"
                placeholder="Email Address"
                required
                className="py-3 px-5 rounded-[30px] grow bg-[rgba(255,255,255,0.1)] text-white outline-none border border-solid border-[rgba(255,255,255,0.3)]"
              />
              <button className="bg-white text-primary py-3 px-6 rounded-[30px] text-[13px] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-300 border-none">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
