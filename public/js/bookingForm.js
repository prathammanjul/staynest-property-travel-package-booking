// || 1. Guest Count Selection & Summary Update ||

let guestSelect = document.getElementById("guests");
guestSelect.addEventListener("change", function () {
  let guestCount = Number(this.value);
  // console.log(guestCount);
  let summaryGuest = document.getElementById("summary-guest");
  summaryGuest.innerHTML = guestCount;
  // console.log(summaryGuest);

  // let basePrice = document.getElementById("base-price");
  // let totalPrice = document.getElementById("total-price");

  // let intBasePrice = Number(basePrice.dataset.price);
  // totalPrice.innerHTML = intBasePrice * guestCount;
  // console.log(intBasePrice);
});

// 2. Disable Past Dates
let today = new Date().toISOString().split("T")[0];

let selectCheckIn = document.getElementById("checkIn");
let selectCheckOut = document.getElementById("checkOut");

checkIn.min = today;
checkOut.min = today;

// 3. Calculate Total Stay Duration (Check-Out Change)
selectCheckOut.addEventListener("change", function () {
  let checkInValue = selectCheckIn.value;
  let checkOutValue = this.value;

  let checkInDate = new Date(checkInValue);
  let checkOutDate = new Date(checkOutValue);

  let totalDays =
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

  let totalDuration = document.getElementsByClassName("days");

  totalDuration[0].innerText = totalDays;
});

// 4. Applied Check-Out > Check-In Rule
selectCheckIn.addEventListener("change", function () {
  let checkInDate = new Date(this.value);

  // add 1 day
  checkInDate.setDate(checkInDate.getDate() + 1);

  let minCheckout = checkInDate.toISOString().split("T")[0];
  selectCheckOut.min = minCheckout;
});

// 5. Back Button
document.getElementById("backBtn").addEventListener("click", function () {
  window.history.back();
});

// 6. Booking Overlap Detection Logic (UI Side)
function isDateBooked(dateStr) {
  const date = new Date(dateStr);

  for (booking of bookedRanges) {
    let start = new Date(booking.checkIn);
    let end = new Date(booking.checkOut);

    if (date >= start && date < end) {
      return true; //date already booked
    }
  }

  return false; //avilable
}
// 7. Prevent Selecting Already Booked Dates (Check-In and Check-Out)
selectCheckIn.addEventListener("change", function () {
  if (isDateBooked(this.value)) {
    alert("This date is already booked");
    this.value = "";
  }
});
selectCheckOut.addEventListener("change", function () {
  if (isDateBooked(this.value)) {
    alert("This date is already booked");
    this.value = "";
  }
});
