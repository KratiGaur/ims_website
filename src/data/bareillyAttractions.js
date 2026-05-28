const baseUrl = import.meta.env.BASE_URL || '/';

function assetPath(path) {
  return `${baseUrl}${path}`.replace(/\/{2,}/g, '/').replace(':/', '://');
}

export const bareillyAttractions = [
  {
    title: 'Jhumka Bareilly',
    image: assetPath('bareilly/Jhumka_Bareilly_city_03.jpg.jpeg'),
    label: 'City Icon',
    description:
      "A contemporary city landmark inspired by Bareilly's famous jhumka identity and one of the most recognizable visual symbols for visitors."
  },
  {
    title: 'Dargah E Ala Hazrat',
    image: assetPath('bareilly/Dargah E Ala Hazrat.jpg.jpeg'),
    label: 'Heritage',
    description:
      "A revered spiritual destination known across India and abroad, representing Bareilly's layered religious and cultural character."
  },
  {
    title: 'Ahichhatra',
    image: assetPath('bareilly/Ahichchhatra Fort Temple Bareilly.jpg.jpeg'),
    label: 'History',
    description:
      'An important archaeological and historical site near Bareilly that connects the region to an ancient civilizational past.'
  },
  {
    title: 'Trivati Nath Mandir',
    image: assetPath('bareilly/Trivatri Nath  Mandir.jpg.jpeg'),
    label: 'Nath Nagri',
    description:
      "One of Bareilly's best-known temples, deeply tied to the city's identity as Nath Nagri and popular among devotees year-round."
  },
  {
    title: 'Nath Nagari Bareilly',
    image: assetPath('bareilly/Nath Nagari Bareilly.jpeg'),
    label: 'Civic Icon',
    description:
      "A strong local identity marker for Bareilly that reflects the city's spiritual character and its familiar everyday visual memory."
  },
  {
    title: 'Alahazrat Imam Tomb',
    image: assetPath('bareilly/Alahazrat Imam  Tomb.jpg.jpeg'),
    label: 'Heritage',
    description:
      "A significant heritage and spiritual site in Bareilly that anchors the city's religious landscape and public recognition."
  },
  {
    title: 'Hartmann College Bareilly',
    image: assetPath('bareilly/Hartmann College Bareilly.jpg.jpeg'),
    label: 'Education',
    description:
      "A familiar institutional landmark that reflects Bareilly's long-standing educational presence and civic memory."
  },
  {
    title: "Chunne Miyan's Lakshmi",
    image: assetPath('bareilly/chunne-miyan-s-lakshmi.jpg.jpeg'),
    label: 'Heritage',
    description:
      'A distinctive Bareilly landmark image that broadens the attraction set with another recognizable local visual reference.'
  }
];
