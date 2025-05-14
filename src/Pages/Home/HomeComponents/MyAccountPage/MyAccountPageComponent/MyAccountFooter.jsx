const MyAccountFooter = () => {
  return (
    <div className="border-t mt-10 bg-white text-gray-500 py-10 font-medium">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex items-start gap-4">
          <div className="text-3xl">🚚</div>
          <div className="text-left">
            <h4 className="font-semibold text-base text-[#6E4E37]">Free Shipping</h4>
            <p className="text-sm">Free shipping for orders above $50</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-3xl">💳</div>
          <div className="text-left">
            <h4 className="font-semibold text-base text-[#6E4E37]">Flexible Payment</h4>
            <p className="text-sm">Multiple secure payment options</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-3xl">🎧</div>
          <div className="text-left">
            <h4 className="font-semibold text-base text-[#6E4E37]">24x7 Support</h4>
            <p className="text-sm">We support online all days</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccountFooter;
