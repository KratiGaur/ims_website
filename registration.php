<?php
$pageTitle = "YROC 13th Conference | Registration";
$currentPage = "registration";
include 'header.php';
?>

<section class="py-2" data-aos="fade-up">
  <div class="glass-card p-4 p-md-5">
    <h1 class="section-title mb-4">Registration Form</h1>
    <form class="row g-3 needs-validation" novalidate>
      <div class="col-md-6">
        <label for="name" class="form-label">Full Name</label>
        <input type="text" class="form-control bg-slate-900/40 text-white border-slate-600" id="name" required />
        <div class="invalid-feedback">Please enter your name.</div>
      </div>
      <div class="col-md-6">
        <label for="email" class="form-label">Email Address</label>
        <input type="email" class="form-control bg-slate-900/40 text-white border-slate-600" id="email" required />
        <div class="invalid-feedback">Enter a valid email.</div>
      </div>
      <div class="col-md-6">
        <label for="phone" class="form-label">Phone Number</label>
        <input type="tel" class="form-control bg-slate-900/40 text-white border-slate-600" id="phone" required pattern="[0-9]{10}" />
        <div class="invalid-feedback">Enter a 10-digit phone number.</div>
      </div>
      <div class="col-md-6">
        <label for="institution" class="form-label">Institution</label>
        <input type="text" class="form-control bg-slate-900/40 text-white border-slate-600" id="institution" required />
        <div class="invalid-feedback">Institution is required.</div>
      </div>
      <div class="col-md-6">
        <label for="category" class="form-label">Participant Category</label>
        <select id="category" class="form-select bg-slate-900/40 text-white border-slate-600" required>
          <option value="" selected disabled>Select category</option>
          <option>Undergraduate Student</option>
          <option>Postgraduate Student</option>
          <option>Research Scholar</option>
          <option>Faculty</option>
          <option>Industry Professional</option>
        </select>
        <div class="invalid-feedback">Please select a category.</div>
      </div>
      <div class="col-md-6">
        <label for="city" class="form-label">City</label>
        <input type="text" class="form-control bg-slate-900/40 text-white border-slate-600" id="city" required />
        <div class="invalid-feedback">City is required.</div>
      </div>
      <div class="col-12">
        <label for="interest" class="form-label">Research Interest</label>
        <textarea id="interest" rows="4" class="form-control bg-slate-900/40 text-white border-slate-600" placeholder="Tell us your topic focus..." required></textarea>
        <div class="invalid-feedback">Please share your research interest.</div>
      </div>
      <div class="col-12">
        <button type="submit" class="btn btn-info btn-glow px-4 py-2 rounded-pill fw-semibold">Submit Registration</button>
      </div>
    </form>
  </div>
</section>

<script>
  (() => {
    "use strict";
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
      form.addEventListener("submit", (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          alert("Registration submitted successfully (demo frontend).");
        }
        form.classList.add("was-validated");
      }, false);
    });
  })();
</script>

<?php include 'footer.php'; ?>
