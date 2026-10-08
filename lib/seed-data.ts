// Dữ liệu mẫu (icon là khoá trong components/icons.tsx) – được nạp tự động khi cơ sở dữ liệu còn trống.
export const seedCategories = [
  { slug: "rau-cu", name: "Rau củ", icon: "leafy-green", description: "Rau xanh, củ quả tươi thu hoạch mỗi sáng từ các nông trại đạt chuẩn VietGAP tại Đà Lạt, Củ Chi." },
  { slug: "trai-cay", name: "Trái cây", icon: "apple", description: "Trái cây Việt Nam và nhập khẩu, chín tự nhiên, ngọt thơm, không chất bảo quản." },
  { slug: "thit-tuoi", name: "Thịt tươi", icon: "beef", description: "Thịt heo, bò, gà tươi trong ngày, có giấy kiểm dịch, đóng gói hút chân không." },
  { slug: "hai-san", name: "Hải sản", icon: "fish", description: "Tôm, cá, mực, nghêu sò đánh bắt trong ngày từ Vũng Tàu, Phan Thiết, Nha Trang." },
  { slug: "trung-sua", name: "Trứng & Sữa", icon: "egg", description: "Trứng gà, trứng vịt, sữa tươi, sữa chua và các sản phẩm từ sữa." },
  { slug: "do-kho-gia-vi", name: "Đồ khô & Gia vị", icon: "wheat", description: "Gạo, nước mắm, dầu ăn, gia vị và đồ khô thiết yếu cho căn bếp Việt." },
];

type SeedProduct = {
  slug: string; name: string; category: string; price: number; compare?: number; unit: string;
  stock: number; icon: string; origin: string; short: string; desc: string; featured?: boolean;
};

export const seedProducts: SeedProduct[] = [
  { slug: "rau-muong-huu-co", name: "Rau muống hữu cơ", category: "rau-cu", price: 15000, compare: 18000, unit: "bó 500g", stock: 120, icon: "leafy-green", origin: "Củ Chi", short: "Rau muống trồng hữu cơ, giòn ngọt, thích hợp xào tỏi, luộc chấm kho quẹt.", desc: "Rau muống được trồng theo tiêu chuẩn hữu cơ tại nông trại Củ Chi, không sử dụng thuốc trừ sâu hoá học. Thu hoạch lúc sáng sớm và giao trong ngày để giữ độ tươi giòn.", featured: true },
  { slug: "ca-chua-bi-da-lat", name: "Cà chua bi Đà Lạt", category: "rau-cu", price: 35000, unit: "hộp 500g", stock: 80, icon: "cherry", origin: "Đà Lạt", short: "Cà chua bi đỏ mọng, vị chua ngọt, ăn sống hoặc làm salad.", desc: "Cà chua bi trồng trong nhà kính tại Đà Lạt, đạt chuẩn VietGAP. Giàu lycopene và vitamin C, rất tốt cho sức khoẻ.", featured: true },
  { slug: "ca-rot-da-lat", name: "Cà rốt Đà Lạt", category: "rau-cu", price: 25000, unit: "kg", stock: 150, icon: "carrot", origin: "Đà Lạt", short: "Cà rốt củ to, màu cam đẹp, ngọt tự nhiên.", desc: "Cà rốt Đà Lạt giàu beta-caroten, dùng để nấu canh, hầm xương, ép nước hoặc làm salad." },
  { slug: "bong-cai-xanh", name: "Bông cải xanh (súp lơ)", category: "rau-cu", price: 45000, unit: "kg", stock: 60, icon: "salad", origin: "Đà Lạt", short: "Bông cải xanh tươi, bông chắc, xanh đậm.", desc: "Bông cải xanh giàu chất xơ và vitamin K. Thích hợp luộc, xào tỏi, xào bò." },
  { slug: "khoai-lang-mat", name: "Khoai lang mật", category: "rau-cu", price: 32000, unit: "kg", stock: 90, icon: "bean", origin: "Đà Lạt", short: "Khoai lang mật dẻo, ngọt lịm, chảy mật khi nướng.", desc: "Khoai lang mật Đà Lạt, ruột vàng cam, nướng hoặc luộc đều thơm ngon." },
  { slug: "dua-leo-baby", name: "Dưa leo baby", category: "rau-cu", price: 28000, unit: "kg", stock: 70, icon: "sprout", origin: "Lâm Đồng", short: "Dưa leo baby giòn, ít hạt, ăn sống rất mát.", desc: "Dưa leo baby trồng nhà màng, vỏ mỏng, giòn ngọt, dùng ăn kèm hoặc làm salad." },

  { slug: "xoai-cat-hoa-loc", name: "Xoài cát Hoà Lộc", category: "trai-cay", price: 85000, compare: 95000, unit: "kg", stock: 50, icon: "citrus", origin: "Tiền Giang", short: "Đặc sản xoài cát Hoà Lộc thơm lừng, thịt vàng mịn.", desc: "Xoài cát Hoà Lộc chính gốc Cái Bè, Tiền Giang. Chín cây tự nhiên, vị ngọt đậm, thơm đặc trưng.", featured: true },
  { slug: "buoi-da-xanh", name: "Bưởi da xanh Bến Tre", category: "trai-cay", price: 65000, unit: "trái ~1.5kg", stock: 40, icon: "citrus", origin: "Bến Tre", short: "Bưởi da xanh ruột hồng, mọng nước, không hạt.", desc: "Bưởi da xanh Bến Tre có tép bưởi hồng, ráo nước, vị ngọt thanh. Quà biếu ý nghĩa." },
  { slug: "dua-hau-long-an", name: "Dưa hấu Long An", category: "trai-cay", price: 18000, unit: "kg", stock: 100, icon: "apple", origin: "Long An", short: "Dưa hấu ruột đỏ, ngọt mát, giải nhiệt mùa hè.", desc: "Dưa hấu Long An vỏ mỏng, ruột đỏ tươi, ngọt sắc." },
  { slug: "chuoi-gia-nam", name: "Chuối già Nam Mỹ", category: "trai-cay", price: 30000, unit: "nải ~1.2kg", stock: 60, icon: "banana", origin: "Đồng Nai", short: "Chuối già chín vàng, thơm, giàu kali.", desc: "Chuối già giống Nam Mỹ trồng tại Đồng Nai, quả to đều, chín tự nhiên." },
  { slug: "nho-xanh-ninh-thuan", name: "Nho xanh Ninh Thuận", category: "trai-cay", price: 75000, unit: "kg", stock: 35, icon: "grape", origin: "Ninh Thuận", short: "Nho xanh giòn, vị chua ngọt hài hoà.", desc: "Nho xanh NH01-48 Ninh Thuận, chùm to, quả giòn, vị ngọt thanh pha chút chua.", featured: true },
  { slug: "tao-envy-new-zealand", name: "Táo Envy New Zealand", category: "trai-cay", price: 159000, compare: 179000, unit: "kg", stock: 25, icon: "apple", origin: "New Zealand", short: "Táo Envy nhập khẩu giòn ngọt, thơm hương mật ong.", desc: "Táo Envy nhập khẩu chính ngạch từ New Zealand, vỏ đỏ bóng, thịt trắng giòn, lâu thâm." },

  { slug: "ba-roi-heo", name: "Ba rọi heo", category: "thit-tuoi", price: 145000, unit: "500g", stock: 40, icon: "ham", origin: "Đồng Nai", short: "Ba rọi heo tươi, tỉ lệ nạc mỡ cân đối.", desc: "Ba rọi heo từ trang trại đạt chuẩn, có giấy kiểm dịch. Phù hợp luộc, kho tộ, nướng.", featured: true },
  { slug: "thit-bo-uc", name: "Thăn bò Úc", category: "thit-tuoi", price: 289000, unit: "500g", stock: 20, icon: "beef", origin: "Úc", short: "Thăn bò Úc mềm, vân mỡ đẹp, áp chảo tuyệt hảo.", desc: "Thăn ngoại bò Úc nhập khẩu, cấp đông và rã đông đúng chuẩn, thịt mềm ngọt." },
  { slug: "ga-ta-tha-vuon", name: "Gà ta thả vườn", category: "thit-tuoi", price: 165000, unit: "con ~1.3kg", stock: 25, icon: "drumstick", origin: "Bình Định", short: "Gà ta thả vườn thịt chắc, da giòn vàng.", desc: "Gà ta nuôi thả vườn trên 5 tháng, làm sạch sẵn, thích hợp luộc, hấp lá chanh." },
  { slug: "suon-non-heo", name: "Sườn non heo", category: "thit-tuoi", price: 175000, unit: "500g", stock: 30, icon: "bone", origin: "Đồng Nai", short: "Sườn non nhiều thịt, nấu canh, ram mặn đều ngon.", desc: "Sườn non heo tươi, chặt khúc vừa ăn, đóng khay sạch sẽ." },

  { slug: "tom-su-song", name: "Tôm sú tươi", category: "hai-san", price: 320000, compare: 350000, unit: "500g", stock: 20, icon: "shrimp", origin: "Cà Mau", short: "Tôm sú Cà Mau size 20–25 con/kg, thịt chắc ngọt.", desc: "Tôm sú nuôi quảng canh tại Cà Mau, giao tươi trong ngày. Hấp bia, nướng muối ớt đều tuyệt.", featured: true },
  { slug: "ca-hoi-na-uy", name: "Cá hồi Na Uy phi lê", category: "hai-san", price: 365000, unit: "300g", stock: 15, icon: "fish", origin: "Na Uy", short: "Cá hồi Na Uy tươi, thịt cam đỏ, béo ngậy.", desc: "Phi lê cá hồi Na Uy nhập khẩu bằng đường hàng không, dùng làm sashimi hoặc áp chảo." },
  { slug: "muc-ong-phan-thiet", name: "Mực ống Phan Thiết", category: "hai-san", price: 210000, unit: "500g", stock: 18, icon: "fish", origin: "Phan Thiết", short: "Mực ống câu tươi, thịt dày giòn.", desc: "Mực ống câu đêm tại Phan Thiết, làm sạch sẵn. Hấp gừng, xào chua ngọt hay nướng sa tế." },
  { slug: "ngheu-lua", name: "Nghêu lụa", category: "hai-san", price: 60000, unit: "kg", stock: 40, icon: "shell", origin: "Bến Tre", short: "Nghêu lụa đã ngâm sạch cát, ruột đầy.", desc: "Nghêu lụa Bến Tre đã được ngâm nhả cát, nấu canh chua hay hấp sả đều ngon." },

  { slug: "trung-ga-ta", name: "Trứng gà ta", category: "trung-sua", price: 42000, unit: "hộp 10 quả", stock: 100, icon: "egg", origin: "Long An", short: "Trứng gà ta lòng đỏ đậm, thơm béo.", desc: "Trứng gà ta từ trang trại nuôi thả, được kiểm tra và làm sạch vỏ trước khi đóng hộp.", featured: true },
  { slug: "sua-tuoi-thanh-trung", name: "Sữa tươi thanh trùng", category: "trung-sua", price: 38000, unit: "chai 1L", stock: 60, icon: "milk", origin: "Mộc Châu", short: "Sữa tươi thanh trùng nguyên chất, không đường.", desc: "Sữa bò tươi Mộc Châu thanh trùng, giữ trọn vị béo tự nhiên. Bảo quản lạnh 2–6°C." },
  { slug: "sua-chua-nep-cam", name: "Sữa chua nếp cẩm", category: "trung-sua", price: 32000, unit: "lốc 4 hũ", stock: 50, icon: "milk", origin: "Hà Nội", short: "Sữa chua nếp cẩm dẻo thơm, chua ngọt dịu.", desc: "Sữa chua lên men tự nhiên kết hợp nếp cẩm, tốt cho tiêu hoá." },

  { slug: "gao-st25", name: "Gạo ST25", category: "do-kho-gia-vi", price: 185000, compare: 199000, unit: "túi 5kg", stock: 80, icon: "wheat", origin: "Sóc Trăng", short: "Gạo ST25 – gạo ngon nhất thế giới, dẻo thơm.", desc: "Gạo ST25 chính hãng Sóc Trăng, hạt dài, cơm dẻo mềm, thơm mùi lá dứa.", featured: true },
  { slug: "nuoc-mam-phu-quoc", name: "Nước mắm Phú Quốc 40 độ đạm", category: "do-kho-gia-vi", price: 95000, unit: "chai 500ml", stock: 70, icon: "amphora", origin: "Phú Quốc", short: "Nước mắm cốt cá cơm, 40 độ đạm, thơm đậm đà.", desc: "Nước mắm truyền thống ủ chượp 12 tháng trong thùng gỗ tại Phú Quốc." },
  { slug: "dau-me-nguyen-chat", name: "Dầu mè nguyên chất", category: "do-kho-gia-vi", price: 78000, unit: "chai 250ml", stock: 45, icon: "droplet", origin: "Bình Định", short: "Dầu mè ép lạnh, thơm béo tự nhiên.", desc: "Dầu mè đen ép lạnh, không pha trộn, dùng trộn salad, làm nước chấm." },
  { slug: "tieu-den-phu-quoc", name: "Tiêu đen Phú Quốc", category: "do-kho-gia-vi", price: 55000, unit: "hũ 100g", stock: 60, icon: "nut", origin: "Phú Quốc", short: "Tiêu đen hạt chắc, cay nồng thơm.", desc: "Hạt tiêu đen Phú Quốc phơi nắng tự nhiên, xay ngay trước khi dùng để giữ hương." },
];
