return (
    <div className="receipt">
    <h2 className="name">Name Course: {course.name}</h2>
    <p className="greeting">Thank you for your order!</p>
    {/* Order info */}
    <div className="order">
      <p>Order No: 1234567890</p>
      <p>Date: 4/5/2020</p>
      <p>Shipping Address: My sweet home</p>
    </div>
    <hr />
    {/* Details */}
    <div className="details">
      <h3>Details</h3>
      <div className="product">
        <img src="https://www.freeiconspng.com/uploads/aesthetic-chair-png-5.png" alt="" />
        <div className="info">
          <h4>Zmerc</h4>
          <p>Color: Mercine</p>
          <p>Qty: 1</p>
        </div>
      </div>
      <p>128 $</p>
    </div>
    {/* Sub and total price */}
    <div className="totalprice">
      <p className="sub">
        Subtotal <span>Price:{course.price}VND</span>
      </p>
      <p className="del">
        Delivery <span>10 $</span>
      </p>
      <hr />
      <p className="tot">
        Total <span>138 $</span>
      </p>
    </div>

    {/* Footer */}
    <footer>Lorem ipsum dolor sit amet consectetur adipisicing.</footer>
  </div>
    );