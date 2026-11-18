import type { Language, OrderStatus, PaymentMethod } from '../types.ts';

export interface TranslationBundle {
  nav: {
    boxes: string;
    delivery: string;
    customBox: string;
    trackOrder: string;
    cart: string;
    account: string;
    admin: string;
  };
  themes: {
    label: string;
    light: string;
    dark: string;
    brand: string;
  };
  languages: {
    en: string;
    fr: string;
    ht: string;
  };
  hero: {
    exploreCta: string;
    customCta: string;
    exchangeRateLabel: string;
    guestNote: string;
  };
  catalog: {
    heading: string;
    subheading: string;
    available: string;
    unavailable: string;
    noPhotoYet: string;
    noDescriptionYet: string;
    viewDetails: string;
    addToCart: string;
    addedToCart: string;
    priceNote: string;
    emptyCatalog: string;
    loading: string;
    errorLoad: string;
    retry: string;
  };
  productModal: {
    close: string;
    quantity: string;
    usdPrice: string;
    htgPrice: string;
    availability: string;
    addToCart: string;
  };
  delivery: {
    heading: string;
    subheading: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  customBox: {
    heading: string;
    subheading: string;
    description: string;
    whatsappCta: string;
    whatsappNotConfigured: string;
    whatsappPrefill: string;
  };
  tracker: {
    heading: string;
    subheading: string;
    placeholder: string;
    button: string;
    searching: string;
    notFound: string;
    reference: string;
    status: string;
    total: string;
    date: string;
    items: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    browseBoxes: string;
    currencyLabel: string;
    subtotal: string;
    total: string;
    remove: string;
    checkoutTitle: string;
    guestBadge: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    address: string;
    addressPlaceholder: string;
    instructions: string;
    instructionsPlaceholder: string;
    boxPeriodLabel: string;
    periodUnitLabel: string;
    periodCountLabel: string;
    periodPresets: {
      weekSingular: string;
      weekPlural: string;
      monthSingular: string;
      monthPlural: string;
    };
    householdSizeLabel: string;
    personsUnit: string;
    personSingular: string;
    periodAndPersonsError: string;
    paymentMethod: string;
    submitOrder: string;
    submitting: string;
    savedAddressUse: string;
    validationError: string;
    confirmationTitle: string;
    confirmationSubtitle: string;
    orderRefLabel: string;
    paymentSelected: string;
    continueShopping: string;
  };
  paymentMethods: Record<PaymentMethod, string>;
  orderStatuses: Record<OrderStatus, string>;
  account: {
    title: string;
    subtitle: string;
    signInGoogle: string;
    signingIn: string;
    signOut: string;
    guestReminder: string;
    tabProfile: string;
    tabOrders: string;
    tabSubscriptions: string;
    fullName: string;
    phone: string;
    defaultAddress: string;
    saveProfile: string;
    saving: string;
    savedSuccess: string;
    savedAddressesTitle: string;
    addAddressLabel: string;
    addressLabelPlaceholder: string;
    addressTextPlaceholder: string;
    addAddressBtn: string;
    noOrders: string;
    subTitle: string;
    subNotice: string;
    subFrequency: string;
    weekly: string;
    monthly: string;
    subDay: string;
    subBox: string;
    subNotes: string;
    subSaveBtn: string;
    subSaved: string;
    subStatusWaitlist: string;
    subStatusPaused: string;
    subStatusCancelled: string;
  };
  comments: {
    heading: string;
    subheading: string;
    nameLabel: string;
    namePlaceholder: string;
    ratingLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    submitBtn: string;
    submitting: string;
    successMsg: string;
    validationError: string;
    emptyState: string;
  };
  footer: {
    tagline: string;
    contactTitle: string;
    socialTitle: string;
    linksTitle: string;
    adminLink: string;
    whatsappLabel: string;
    rights: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    nav: {
      boxes: 'Food Boxes',
      delivery: 'Delivery',
      customBox: 'Build Your Own Box',
      trackOrder: 'Track Order',
      cart: 'Cart',
      account: 'Account',
      admin: 'Owner Admin',
    },
    themes: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      brand: 'Brand',
    },
    languages: {
      en: 'EN',
      fr: 'FR',
      ht: 'Kreyòl',
    },
    hero: {
      exploreCta: 'Explore Our Food Boxes',
      customCta: 'Build Your Own Box',
      exchangeRateLabel: 'Today’s Rate',
      guestNote: 'Order directly as a guest — no account required.',
    },
    catalog: {
      heading: 'Our Food Boxes',
      subheading: 'Select a box, view details in USD or HTG, and submit your order in seconds.',
      available: 'Available',
      unavailable: 'Currently Unavailable',
      noPhotoYet: 'Photo placeholder — customizable in Admin',
      noDescriptionYet: 'Box contents and details can be configured by the store owner.',
      viewDetails: 'View Details',
      addToCart: 'Add to Cart',
      addedToCart: 'Added',
      priceNote: 'Select USD or HTG at the top or in your cart',
      emptyCatalog: 'No food boxes are listed right now.',
      loading: 'Loading food boxes...',
      errorLoad: 'Could not load storefront catalog.',
      retry: 'Try Again',
    },
    productModal: {
      close: 'Close',
      quantity: 'Quantity',
      usdPrice: 'Price (USD)',
      htgPrice: 'Price (HTG)',
      availability: 'Status',
      addToCart: 'Add to Cart',
    },
    delivery: {
      heading: 'How UrFoodBox Delivery Works',
      subheading: 'Simple, dependable grocery delivery — Machew devan pot kay ou.',
      step1Title: '01. Choose Your Food Box',
      step1Desc: 'Browse our curated food boxes or request a custom grocery package tailored to your household.',
      step2Title: '02. Checkout Without Friction',
      step2Desc: 'Enter your name, phone, and delivery address, then pick Cash on Delivery, Wire, MonCash, or Natcash.',
      step3Title: '03. Doorstep Delivery',
      step3Desc: 'Track your order reference while our team prepares and delivers your groceries directly to your door.',
    },
    customBox: {
      heading: 'Build Your Own Box',
      subheading: 'Want specific groceries or a custom family package?',
      description: 'Tell us exactly which items and quantities you need. Chat directly with the UrFoodBox team on WhatsApp to customize your order.',
      whatsappCta: 'Order Custom Box on WhatsApp',
      whatsappNotConfigured: 'WhatsApp number can be configured by the owner in Admin Settings.',
      whatsappPrefill: 'Hello UrFoodBox! I would like to build a custom grocery box.',
    },
    tracker: {
      heading: 'Track Your Order',
      subheading: 'Enter the unique order reference you received at checkout.',
      placeholder: 'e.g. UFB-20261115-A1B2C3',
      button: 'Check Status',
      searching: 'Checking...',
      notFound: 'No order found with that reference.',
      reference: 'Reference',
      status: 'Status',
      total: 'Total',
      date: 'Order Date',
      items: 'Items',
    },
    cart: {
      title: 'Your Cart & Checkout',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Add a food box from our catalog to begin your order.',
      browseBoxes: 'Explore Food Boxes',
      currencyLabel: 'Display & Order Currency',
      subtotal: 'Subtotal',
      total: 'Total',
      remove: 'Remove',
      checkoutTitle: 'Delivery & Payment Details',
      guestBadge: 'Guest checkout — no sign-up needed',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      phone: 'Phone Number',
      phonePlaceholder: '+509 ...',
      address: 'Delivery Address',
      addressPlaceholder: 'Street, neighborhood, landmark...',
      instructions: 'Order Instructions (Optional)',
      instructionsPlaceholder: 'Gate code, preferred delivery time, notes...',
      boxPeriodLabel: 'How long do you need this food box for?',
      periodUnitLabel: 'Time unit',
      periodCountLabel: 'Number (1–5)',
      periodPresets: {
        weekSingular: 'Week',
        weekPlural: 'Weeks',
        monthSingular: 'Month',
        monthPlural: 'Months',
      },
      householdSizeLabel: 'For how many persons?',
      personsUnit: 'persons',
      personSingular: 'person',
      periodAndPersonsError: 'Please choose how long you need the food box for and how many persons it is for.',
      paymentMethod: 'Payment Method',
      submitOrder: 'Submit Order',
      submitting: 'Submitting Order...',
      savedAddressUse: 'Saved addresses:',
      validationError: 'Please fill in your full name, phone number, and delivery address.',
      confirmationTitle: 'Order Submitted Successfully',
      confirmationSubtitle: 'Thank you for ordering with UrFoodBox. Save your reference below to track your delivery.',
      orderRefLabel: 'Order Reference',
      paymentSelected: 'Payment Method',
      continueShopping: 'Continue Shopping',
    },
    paymentMethods: {
      cash_on_delivery: 'Cash on Delivery',
      wire: 'Bank Wire Transfer',
      moncash: 'MonCash',
      natcash: 'Natcash',
    },
    orderStatuses: {
      New: 'New',
      Confirmed: 'Confirmed',
      Preparing: 'Preparing',
      'Out for delivery': 'Out for delivery',
      Delivered: 'Delivered',
      Cancelled: 'Cancelled',
    },
    account: {
      title: 'Customer Account (Optional)',
      subtitle: 'Save delivery addresses, view past orders, and register interest for upcoming grocery subscriptions.',
      signInGoogle: 'Continue with Google',
      signingIn: 'Signing in...',
      signOut: 'Sign Out',
      guestReminder: 'Creating an account is completely optional. You can always check out as a guest.',
      tabProfile: 'Profile & Addresses',
      tabOrders: 'Order History',
      tabSubscriptions: 'Subscriptions',
      fullName: 'Full Name',
      phone: 'Phone Number',
      defaultAddress: 'Default Delivery Address',
      saveProfile: 'Save Profile',
      saving: 'Saving...',
      savedSuccess: 'Profile updated.',
      savedAddressesTitle: 'Saved Delivery Addresses',
      addAddressLabel: 'Add Another Address',
      addressLabelPlaceholder: 'Label (e.g. Home, Office)',
      addressTextPlaceholder: 'Full street address',
      addAddressBtn: 'Add Address',
      noOrders: 'No orders linked to this account yet.',
      subTitle: 'Grocery Subscription Preferences',
      subNotice: 'Recurring payments are not yet activated until an online payment provider is configured. You can save your weekly or monthly delivery preference below.',
      subFrequency: 'Delivery Frequency',
      weekly: 'Weekly',
      monthly: 'Monthly',
      subDay: 'Preferred Delivery Day',
      subBox: 'Preferred Food Box',
      subNotes: 'Preference Notes',
      subSaveBtn: 'Save Subscription Preference',
      subSaved: 'Subscription preference saved to waitlist.',
      subStatusWaitlist: 'Waitlist (No billing active)',
      subStatusPaused: 'Paused',
      subStatusCancelled: 'Cancelled',
    },
    comments: {
      heading: 'Client Comments & Reviews',
      subheading: 'Share your experience with UrFoodBox or read what other families say.',
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your name',
      ratingLabel: 'Rating',
      commentLabel: 'Your Comment',
      commentPlaceholder: 'Tell us about your food box or delivery experience...',
      submitBtn: 'Post Comment',
      submitting: 'Posting...',
      successMsg: 'Thank you! Your comment has been posted.',
      validationError: 'Please enter your name and a comment (at least 3 characters).',
      emptyState: 'No comments yet. Be the first client to share your feedback.',
    },
    footer: {
      tagline: 'Machew devan pot kay ou.',
      contactTitle: 'Contact',
      socialTitle: 'Social Media',
      linksTitle: 'Quick Links',
      adminLink: 'Owner Admin Dashboard',
      whatsappLabel: 'WhatsApp',
      rights: 'All rights reserved.',
    },
  },
  fr: {
    nav: {
      boxes: 'Paniers',
      delivery: 'Livraison',
      customBox: 'Créer Mon Panier',
      trackOrder: 'Suivre Commande',
      cart: 'Panier',
      account: 'Compte',
      admin: 'Admin Propriétaire',
    },
    themes: {
      label: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      brand: 'Marque',
    },
    languages: {
      en: 'EN',
      fr: 'FR',
      ht: 'Kreyòl',
    },
    hero: {
      exploreCta: 'Découvrir Nos Paniers',
      customCta: 'Créer Mon Panier',
      exchangeRateLabel: 'Taux du Jour',
      guestNote: 'Commandez directement sans créer de compte.',
    },
    catalog: {
      heading: 'Nos Paniers Alimentaires',
      subheading: 'Choisissez un panier, consultez les prix en USD ou HTG et passez votre commande en quelques secondes.',
      available: 'Disponible',
      unavailable: 'Indisponible',
      noPhotoYet: 'Emplacement photo — modifiable dans l’Admin',
      noDescriptionYet: 'Le contenu et les détails peuvent être configurés par le propriétaire.',
      viewDetails: 'Voir Détails',
      addToCart: 'Ajouter au Panier',
      addedToCart: 'Ajouté',
      priceNote: 'Choisissez USD ou HTG en haut ou dans votre panier',
      emptyCatalog: 'Aucun panier alimentaire disponible pour le moment.',
      loading: 'Chargement des paniers...',
      errorLoad: 'Impossible de charger le catalogue.',
      retry: 'Réessayer',
    },
    productModal: {
      close: 'Fermer',
      quantity: 'Quantité',
      usdPrice: 'Prix (USD)',
      htgPrice: 'Prix (HTG)',
      availability: 'Disponibilité',
      addToCart: 'Ajouter au Panier',
    },
    delivery: {
      heading: 'Comment Fonctionne la Livraison',
      subheading: 'Une livraison d’épicerie fiable et simple — Machew devan pot kay ou.',
      step1Title: '01. Choisissez Votre Panier',
      step1Desc: 'Parcourez nos paniers alimentaires ou demandez un panier sur mesure adapté à votre foyer.',
      step2Title: '02. Commande Sans Inscription',
      step2Desc: 'Saisissez votre nom, téléphone et adresse, puis choisissez Paiement à la livraison, Virement, MonCash ou Natcash.',
      step3Title: '03. Livraison à Domicile',
      step3Desc: 'Suivez votre référence de commande pendant que notre équipe prépare et livre vos courses chez vous.',
    },
    customBox: {
      heading: 'Créer Votre Propre Panier',
      subheading: 'Vous souhaitez des produits spécifiques ou un colis personnalisé ?',
      description: 'Indiquez-nous exactement les articles et quantités souhaités. Discutez directement avec l’équipe UrFoodBox sur WhatsApp.',
      whatsappCta: 'Commander sur WhatsApp',
      whatsappNotConfigured: 'Le numéro WhatsApp peut être configuré par le propriétaire dans les paramètres Admin.',
      whatsappPrefill: 'Bonjour UrFoodBox ! Je souhaite composer un panier d’épicerie personnalisé.',
    },
    tracker: {
      heading: 'Suivre Votre Commande',
      subheading: 'Entrez la référence unique reçue lors de la confirmation.',
      placeholder: 'ex. UFB-20261115-A1B2C3',
      button: 'Vérifier Statut',
      searching: 'Recherche...',
      notFound: 'Aucune commande trouvée avec cette référence.',
      reference: 'Référence',
      status: 'Statut',
      total: 'Total',
      date: 'Date',
      items: 'Articles',
    },
    cart: {
      title: 'Votre Panier & Commande',
      emptyTitle: 'Votre panier est vide',
      emptyDesc: 'Ajoutez un panier alimentaire depuis notre catalogue pour commander.',
      browseBoxes: 'Voir les Paniers',
      currencyLabel: 'Devise d’affichage et de commande',
      subtotal: 'Sous-total',
      total: 'Total',
      remove: 'Retirer',
      checkoutTitle: 'Coordonnées de Livraison & Paiement',
      guestBadge: 'Commande invité — aucune inscription requise',
      fullName: 'Nom Complet',
      fullNamePlaceholder: 'Votre nom complet',
      phone: 'Numéro de Téléphone',
      phonePlaceholder: '+509 ...',
      address: 'Adresse de Livraison',
      addressPlaceholder: 'Rue, quartier, repère...',
      instructions: 'Instructions (Optionnel)',
      instructionsPlaceholder: 'Code d’accès, horaire souhaité, remarques...',
      boxPeriodLabel: 'Pour combien de temps souhaitez-vous ce panier ?',
      periodUnitLabel: 'Unité',
      periodCountLabel: 'Nombre (1–5)',
      periodPresets: {
        weekSingular: 'Semaine',
        weekPlural: 'Semaines',
        monthSingular: 'Mois',
        monthPlural: 'Mois',
      },
      householdSizeLabel: 'Pour combien de personnes ?',
      personsUnit: 'personnes',
      personSingular: 'personne',
      periodAndPersonsError: 'Veuillez indiquer la durée souhaitée et le nombre de personnes.',
      paymentMethod: 'Mode de Paiement',
      submitOrder: 'Confirmer la Commande',
      submitting: 'Envoi en cours...',
      savedAddressUse: 'Adresses enregistrées :',
      validationError: 'Veuillez renseigner votre nom, téléphone et adresse de livraison.',
      confirmationTitle: 'Commande Envoyée avec Succès',
      confirmationSubtitle: 'Merci d’avoir commandé chez UrFoodBox. Conservez votre référence pour suivre la livraison.',
      orderRefLabel: 'Référence de Commande',
      paymentSelected: 'Mode de Paiement',
      continueShopping: 'Continuer vos Achats',
    },
    paymentMethods: {
      cash_on_delivery: 'Paiement à la livraison',
      wire: 'Virement bancaire',
      moncash: 'MonCash',
      natcash: 'Natcash',
    },
    orderStatuses: {
      New: 'Nouvelle',
      Confirmed: 'Confirmée',
      Preparing: 'En préparation',
      'Out for delivery': 'En cours de livraison',
      Delivered: 'Livrée',
      Cancelled: 'Annulée',
    },
    account: {
      title: 'Compte Client (Optionnel)',
      subtitle: 'Enregistrez vos adresses, consultez vos commandes et préparez vos préférences d’abonnement.',
      signInGoogle: 'Continuer avec Google',
      signingIn: 'Connexion...',
      signOut: 'Déconnexion',
      guestReminder: 'La création d’un compte est entièrement facultative. Vous pouvez toujours commander en tant qu’invité.',
      tabProfile: 'Profil & Adresses',
      tabOrders: 'Historique',
      tabSubscriptions: 'Abonnements',
      fullName: 'Nom Complet',
      phone: 'Téléphone',
      defaultAddress: 'Adresse par Défaut',
      saveProfile: 'Enregistrer',
      saving: 'Enregistrement...',
      savedSuccess: 'Profil mis à jour.',
      savedAddressesTitle: 'Adresses Enregistrées',
      addAddressLabel: 'Ajouter une Adresse',
      addressLabelPlaceholder: 'Libellé (ex. Maison, Bureau)',
      addressTextPlaceholder: 'Adresse complète',
      addAddressBtn: 'Ajouter',
      noOrders: 'Aucune commande associée à ce compte pour le moment.',
      subTitle: 'Préférences d’Abonnement Épicerie',
      subNotice: 'Les paiements récurrents ne sont pas encore activés tant qu’un prestataire de paiement n’est pas configuré. Enregistrez vos préférences ci-dessous.',
      subFrequency: 'Fréquence',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      subDay: 'Jour de Livraison Souhaité',
      subBox: 'Panier Souhaité',
      subNotes: 'Notes',
      subSaveBtn: 'Enregistrer la Préférence',
      subSaved: 'Préférence enregistrée sur la liste d’attente.',
      subStatusWaitlist: 'Liste d’attente (Sans facturation)',
      subStatusPaused: 'En pause',
      subStatusCancelled: 'Annulé',
    },
    comments: {
      heading: 'Commentaires & Avis Clients',
      subheading: 'Partagez votre expérience avec UrFoodBox ou lisez les avis d’autres familles.',
      nameLabel: 'Votre Nom',
      namePlaceholder: 'Entrez votre nom',
      ratingLabel: 'Note',
      commentLabel: 'Votre Commentaire',
      commentPlaceholder: 'Parlez-nous de votre panier ou de votre livraison...',
      submitBtn: 'Publier le Commentaire',
      submitting: 'Envoi...',
      successMsg: 'Merci ! Votre commentaire a été publié.',
      validationError: 'Veuillez saisir votre nom et un commentaire (au moins 3 caractères).',
      emptyState: 'Aucun commentaire pour le moment. Soyez le premier client à donner votre avis.',
    },
    footer: {
      tagline: 'Machew devan pot kay ou.',
      contactTitle: 'Contact',
      socialTitle: 'Réseaux Sociaux',
      linksTitle: 'Liens Rapides',
      adminLink: 'Tableau de Bord Propriétaire',
      whatsappLabel: 'WhatsApp',
      rights: 'Tous droits réservés.',
    },
  },
  ht: {
    nav: {
      boxes: 'Bwat Pwovizyon',
      delivery: 'Livrezon',
      customBox: 'Fè Bwat Pa Ou',
      trackOrder: 'Swiv Kòmand',
      cart: 'Panye',
      account: 'Kont',
      admin: 'Espas Pwopriyetè',
    },
    themes: {
      label: 'Tèm',
      light: 'Klè',
      dark: 'Nwa',
      brand: 'Mak',
    },
    languages: {
      en: 'EN',
      fr: 'FR',
      ht: 'Kreyòl',
    },
    hero: {
      exploreCta: 'Dekouvri Bwat Pwovizyon Nou Yo',
      customCta: 'Fè Bwat Pa Ou',
      exchangeRateLabel: 'To Jounen an',
      guestNote: 'Kòmande dirèkteman san ou pa bezwen kreye kont.',
    },
    catalog: {
      heading: 'Bwat Pwovizyon Nou Yo',
      subheading: 'Chwazi yon bwat, gade pri an USD oswa HTG, epi voye kòmand ou byen vit.',
      available: 'Disponib',
      unavailable: 'Pa Disponib Kounye a',
      noPhotoYet: 'Espas foto — pwopriyetè a ka ajoute foto nan Admin',
      noDescriptionYet: 'Pwopriyetè a ka ajoute lis ak detay bwat la nan Espas Pwopriyetè a.',
      viewDetails: 'Gade Detay',
      addToCart: 'Mete nan Panye',
      addedToCart: 'Ajoute',
      priceNote: 'Chwazi USD oswa HTG anlè a oswa nan panye ou',
      emptyCatalog: 'Pa gen bwat pwovizyon ki afiche kounye a.',
      loading: 'Ap chaje bwat pwovizyon yo...',
      errorLoad: 'Nou pa t kapab chaje katalòg la.',
      retry: 'Eseye Ankò',
    },
    productModal: {
      close: 'Fèmen',
      quantity: 'Kantite',
      usdPrice: 'Pri (USD)',
      htgPrice: 'Pri (HTG)',
      availability: 'Disponibilite',
      addToCart: 'Mete nan Panye',
    },
    delivery: {
      heading: 'Kijan Livrezon UrFoodBox Fonksyone',
      subheading: 'Livrezon pwovizyon ki senp epi fyab — Machew devan pot kay ou.',
      step1Title: '01. Chwazi Bwat Pwovizyon Ou',
      step1Desc: 'Gade bwat nou yo oswa mande yon bwat pèsonalize pou fanmi ou.',
      step2Title: '02. Pase Kòmand San Kont',
      step2Desc: 'Mete non ou, telefòn ou, ak adrès ou, epi chwazi Peye lè w resevwa, Viman, MonCash oswa Natcash.',
      step3Title: '03. Livrezon Devan Pòt Kay Ou',
      step3Desc: 'Swiv referans kòmand ou pandan ekip nou an ap prepare epi pote pwovizyon yo devan pòt ou.',
    },
    customBox: {
      heading: 'Fè Bwat Pa Ou',
      subheading: 'Ou bezwen pwodwi espesifik oswa yon pake pèsonalize?',
      description: 'Di nou egzakteman ki pwodwi ak ki kantite ou bezwen. Pale dirèkteman ak ekip UrFoodBox sou WhatsApp.',
      whatsappCta: 'Kòmande Bwat Pèsonalize sou WhatsApp',
      whatsappNotConfigured: 'Pwopriyetè a ka konfigire nimewo WhatsApp la nan Paramèt Admin yo.',
      whatsappPrefill: 'Bonjou UrFoodBox! Mwen ta renmen fè yon bwat pwovizyon pèsonalize.',
    },
    tracker: {
      heading: 'Swiv Kòmand Ou',
      subheading: 'Antre nimewo referans inik ou te resevwa lè w te pase kòmand lan.',
      placeholder: 'egz. UFB-20261115-A1B2C3',
      button: 'Verifye Estati',
      searching: 'Ap chèche...',
      notFound: 'Nou pa jwenn okenn kòmand ak referans sa a.',
      reference: 'Referans',
      status: 'Estati',
      total: 'Total',
      date: 'Dat Kòmand',
      items: 'Pwodwi',
    },
    cart: {
      title: 'Panye & Kòmand Ou',
      emptyTitle: 'Panye ou vid',
      emptyDesc: 'Ajoute yon bwat pwovizyon pou kòmanse kòmand ou.',
      browseBoxes: 'Gade Bwat Yo',
      currencyLabel: 'Lajan pou Afichaj ak Kòmand',
      subtotal: 'Sou-total',
      total: 'Total',
      remove: 'Retire',
      checkoutTitle: 'Enfòmasyon Livrezon & Peman',
      guestBadge: 'Kòmand envite — pa bezwen enskripsyon',
      fullName: 'Non Konplè',
      fullNamePlaceholder: 'Antre non konplè ou',
      phone: 'Nimewo Telefòn',
      phonePlaceholder: '+509 ...',
      address: 'Adrès Livrezon',
      addressPlaceholder: 'Ri, katye, pwen referans...',
      instructions: 'Enstriksyon Kòmand (Opsyonèl)',
      instructionsPlaceholder: 'Lè ou prefere, nòt espesyal...',
      boxPeriodLabel: 'Pou konbyen tan ou bezwen bwat pwovizyon sa a?',
      periodUnitLabel: 'Kalite tan',
      periodCountLabel: 'Chif (1–5)',
      periodPresets: {
        weekSingular: 'Semèn',
        weekPlural: 'Semèn',
        monthSingular: 'Mwa',
        monthPlural: 'Mwa',
      },
      householdSizeLabel: 'Pou konbyen moun?',
      personsUnit: 'moun',
      personSingular: 'moun',
      periodAndPersonsError: 'Tanpri chwazi pou konbyen tan ak pou konbyen moun ou bezwen bwat la.',
      paymentMethod: 'Metòd Peman',
      submitOrder: 'Voye Kòmand lan',
      submitting: 'Ap voye kòmand...',
      savedAddressUse: 'Adrès anrejistre yo:',
      validationError: 'Tanpri ranpli non konplè ou, nimewo telefòn ou, ak adrès livrezon an.',
      confirmationTitle: 'Kòmand Ou Voye ak Siksè',
      confirmationSubtitle: 'Mèsi dèske w kòmande ak UrFoodBox. Konsève referans anba a pou swiv livrezon ou.',
      orderRefLabel: 'Referans Kòmand',
      paymentSelected: 'Metòd Peman',
      continueShopping: 'Kontinye Achte',
    },
    paymentMethods: {
      cash_on_delivery: 'Peye lè ou resevwa (Kach)',
      wire: 'Viman Bankè',
      moncash: 'MonCash',
      natcash: 'Natcash',
    },
    orderStatuses: {
      New: 'Nouvo',
      Confirmed: 'Konfime',
      Preparing: 'Ap prepare',
      'Out for delivery': 'Sou wout livrezon',
      Delivered: 'Livre',
      Cancelled: 'Anile',
    },
    account: {
      title: 'Kont Kliyan (Opsyonèl)',
      subtitle: 'Anrejistre adrès livrezon ou yo, gade ansyen kòmand yo, epi sove preferans abònman.',
      signInGoogle: 'Kontinye ak Google',
      signingIn: 'Ap konekte...',
      signOut: 'Dekonekte',
      guestReminder: 'Kreye yon kont totalman opsyonèl. Ou ka toujou kòmande kòm envite.',
      tabProfile: 'Pwofil & Adrès',
      tabOrders: 'Istorik Kòmand',
      tabSubscriptions: 'Abònman',
      fullName: 'Non Konplè',
      phone: 'Nimewo Telefòn',
      defaultAddress: 'Adrès Prensipal',
      saveProfile: 'Anrejistre Pwofil',
      saving: 'Ap anrejistre...',
      savedSuccess: 'Pwofil mete ajou.',
      savedAddressesTitle: 'Adrès Anrejistre Yo',
      addAddressLabel: 'Ajoute Yon Lòt Adrès',
      addressLabelPlaceholder: 'Tit (egz. Kay, Biwo)',
      addressTextPlaceholder: 'Adrès konplè',
      addAddressBtn: 'Ajoute Adrès',
      noOrders: 'Poko gen kòmand ki lye ak kont sa a.',
      subTitle: 'Preferans Abònman Pwovizyon',
      subNotice: 'Peman otomatik yo poko aktive jiskaske yon founisè peman konfigire. Ou ka anrejistre preferans livrezon ou anba a.',
      subFrequency: 'Frekans Livrezon',
      weekly: 'Chak Semèn',
      monthly: 'Chak Mwa',
      subDay: 'Jou Livrezon Ou Prefere',
      subBox: 'Bwat Pwovizyon Ou Prefere',
      subNotes: 'Nòt Preferans',
      subSaveBtn: 'Anrejistre Preferans Abònman',
      subSaved: 'Preferans abònman anrejistre nan lis datant.',
      subStatusWaitlist: 'Lis datant (Pa gen peman aktif)',
      subStatusPaused: 'Sou poz',
      subStatusCancelled: 'Anile',
    },
    comments: {
      heading: 'Kòmantè & Avi Kliyan Yo',
      subheading: 'Pataje eksperyans ou ak UrFoodBox oswa li sa lòt fanmi yo di.',
      nameLabel: 'Non Ou',
      namePlaceholder: 'Antre non ou',
      ratingLabel: 'Nòt',
      commentLabel: 'Kòmantè Ou',
      commentPlaceholder: 'Di nou kijan ou jwenn bwat pwovizyon ou ak livrezon an...',
      submitBtn: 'Voye Kòmantè',
      submitting: 'Ap voye...',
      successMsg: 'Mèsi! Kòmantè ou pibliye.',
      validationError: 'Tanpri mete non ou ak yon kòmantè (omwen 3 lèt).',
      emptyState: 'Poko gen kòmantè. Se ou ki ka premye kliyan ki kite yon avi.',
    },
    footer: {
      tagline: 'Machew devan pot kay ou.',
      contactTitle: 'Kontak',
      socialTitle: 'Rezo Sosyal',
      linksTitle: 'Lyen Rapid',
      adminLink: 'Espas Pwopriyetè (Admin)',
      whatsappLabel: 'WhatsApp',
      rights: 'Tout dwa rezève.',
    },
  },
};

export function formatMoney(amount: string | number, currency: 'USD' | 'HTG'): string {
  const num = Number(amount) || 0;
  if (currency === 'USD') {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  }
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HTG`;
}

export function getLocalizedProductName(
  product: { nameEn: string; nameFr: string; nameHt: string },
  lang: Language
): string {
  if (lang === 'fr') return product.nameFr || product.nameEn;
  if (lang === 'ht') return product.nameHt || product.nameEn;
  return product.nameEn;
}

export function getLocalizedProductDescription(
  product: { descriptionEn: string; descriptionFr: string; descriptionHt: string },
  lang: Language
): string {
  if (lang === 'fr') return product.descriptionFr || product.descriptionEn || '';
  if (lang === 'ht') return product.descriptionHt || product.descriptionEn || '';
  return product.descriptionEn || '';
}
