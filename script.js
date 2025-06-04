const SUPABASE_URL = 'https://cnmqlwwbjelcpywstvjl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNubXFsd3diamVsY3B5d3N0dmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjM4NzAsImV4cCI6MjA2NDUzOTg3MH0.ckr9RXamNW4raKYycvnsnn7WyYdOAfKiZshVO3AIIE4';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP() {
  const phone = document.getElementById('phone').value;
  const otp = generateOTP();
  const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/AC46218a4f1980623eabd053ef06f977b5/Messages.json", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa("AC46218a4f1980623eabd053ef06f977b5:0676473ca467667c31d957e25ce92ea3"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: "+18455761437",
      To: phone,
      Body: "Your StreetR OTP is: " + otp
    })
  });

  if (response.ok) {
    await supabase.from('otps').insert({ phone: phone, otp: otp });
    document.getElementById('status').textContent = "OTP sent!";
  } else {
    document.getElementById('status').textContent = "Failed to send OTP.";
  }
}

async function verifyOTP() {
  const phone = document.getElementById('phone').value;
  const otp = document.getElementById('otp').value;

  const { data, error } = await supabase
    .from('otps')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1);

  if (data.length && data[0].otp === otp) {
    document.getElementById('status').textContent = "Logged in successfully!";
  } else {
    document.getElementById('status').textContent = "Invalid OTP.";
  }
}
