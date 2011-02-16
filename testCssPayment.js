return (
    <div className="receipt">
    <h2 className="name">Your order information</h2>
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
          <h4>Name Course: {course.name}</h4>
          <p>Qty: 1</p>
        </div>
      </div>
      <p> Price:{course.price && course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</p>
    </div>
    {/* Sub and total price */}
    <div className="totalprice">
      <p className="sub">
        Subtotal <span> Price:{course.price && course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</span>
      </p>
      <p className="del">
        Delivery <span>0 vnd</span>
      </p>
      <hr />
      <p className="tot">
        Total <span> Price:{course.price && course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</span>
      </p>
    </div>

    {/* Footer */}
    <footer> <button onClick={() => handleEnroll()}>Order Now</button></footer>
  </div>
    );