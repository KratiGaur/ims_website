<?php
$pageTitle = $pageTitle ?? "YROC 2027";
$currentPage = $currentPage ?? "home";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($pageTitle); ?></title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
  <link rel="stylesheet" href="css/loader.css" />

  <style>
    :root {
      --bg-primary: #0b1020;
      --bg-secondary: #111827;
      --accent-1: #7c3aed;
      --accent-2: #06b6d4;
      --text-light: #dbeafe;
      --card-bg: rgba(255, 255, 255, 0.08);
      --card-border: rgba(255, 255, 255, 0.18);
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: "Inter", sans-serif;
      color: var(--text-light);
      background: radial-gradient(circle at top left, #1f1147 0%, var(--bg-primary) 45%, #020617 100%);
      min-height: 100vh;
    }

    h1, h2, h3, h4, .brand-font {
      font-family: "Poppins", sans-serif;
    }

    .glass-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 1rem;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    }

    .gradient-text {
      background: linear-gradient(90deg, #a78bfa, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .btn-glow {
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
    }

    .btn-glow:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(34, 211, 238, 0.35);
    }

    .hover-rise {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .hover-rise:hover {
      transform: translateY(-6px);
      box-shadow: 0 14px 30px rgba(2, 6, 23, 0.45);
    }

    .nav-link {
      color: #cbd5e1 !important;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #22d3ee !important;
    }

    .section-title {
      font-weight: 700;
      letter-spacing: 0.2px;
    }
  </style>
</head>
<body class="splash-active">
  <?php include 'splash-screen.php'; ?>
  <header class="sticky-top" style="z-index: 1050;">
    <nav class="navbar navbar-expand-lg glass-card mx-2 mx-md-4 mt-3 px-3 px-md-4 py-2">
      <a class="navbar-brand brand-font text-white fw-bold fs-4" href="index.php">
        <i class="fa-solid fa-microchip text-cyan-300 me-2"></i>YROC 2027
      </a>
      <button class="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto gap-lg-2">
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'home' ? 'active' : ''; ?>" href="index.php">Home</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'about' ? 'active' : ''; ?>" href="about.php">About</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'vision' ? 'active' : ''; ?>" href="vision.php">Vision</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'committee' ? 'active' : ''; ?>" href="committee.php">Committee</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'invitation' ? 'active' : ''; ?>" href="invitation.php">Invitation</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'abstracts' ? 'active' : ''; ?>" href="abstracts.php">Abstracts</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'registration' ? 'active' : ''; ?>" href="registration.php">Registration</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'events' ? 'active' : ''; ?>" href="events.php">Events</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'accommodation' ? 'active' : ''; ?>" href="accommodation.php">Accommodation</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'sponsors' ? 'active' : ''; ?>" href="sponsors.php">Sponsors</a></li>
          <li class="nav-item"><a class="nav-link <?php echo $currentPage === 'brochure' ? 'active' : ''; ?>" href="brochure.php">Brochure</a></li>
        </ul>
      </div>
    </nav>
  </header>
  <main class="container py-5">
