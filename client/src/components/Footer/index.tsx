import { socials } from "@/utils/constant";

export default function Footer() {
  return (
    <footer className="flex lg:gap-11 sm:gap-5 md:gap-7 gap-3 py-5 justify-between px-3">
      <div className="space-y-3">
        <h4>Liên hệ</h4>
        <div className="flex gap-3">
          {
            socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <a key={index} href
                  ={social.path} target="_blank" rel="noreferrer">
                  <Icon size={20} />
                </a>
              )
            })
          }
        </div>
      </div>
      <div className="flex lg:gap-7 items-start gap-3">
        <div className="space-y-3">
          <h4>Địa chỉ</h4>
          <p className="text-sm text-gray-500">Đông Hòa, Dĩ An, Bình Dương</p>
        </div>
        <div className="space-y-3">
          <h4>Bản quyền</h4>
          <p className="text-sm text-gray-500">&copy;2024 KHDLH</p>
        </div>
      </div>
    </footer>
  );
}
