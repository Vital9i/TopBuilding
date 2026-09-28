$ErrorActionPreference = 'Stop'
$root = 'd:\IT\Projects\TopBuilding\projects'
$img = '../../../main_img/projects'

function Enc([string]$rel) {
    if (-not $rel) { return '' }
    return (($rel -split '/') | ForEach-Object {
        if ($_ -eq '..' -or $_ -eq '.' -or $_ -eq '') { $_ } else { [uri]::EscapeDataString($_) }
    }) -join '/'
}

function Img([string]$path) { return (Enc $path) }

$houses = @(
    @{
        dir = 'classic\classic-100'; title = 'Classic 100'; arch = 'Classic'; archHref = '../'
        lead = 'Современный одноэтажный дом для комфортной жизни семьи'
        area = '100 м²'; beds = '3'; baths = '2'; floors = '1 этаж'; terrace = 'Терраса с крышей'
        hero = "$img/Classic/classic1.webp"
        price = '≈ 312 000 руб'
        video = ''
        overview = 'Classic 100 — одноэтажный дом с тремя спальнями и крытой террасой. Планировка без лестниц удобна для семьи: общая гостиная связана с кухней и выходом на улицу, спальни отделены от дневной зоны.'
        points = @('Функциональные планировки','Большое естественное освещение','Крытая терраса для отдыха','Современный архитектурный стиль','Подходит для участков от 10 соток','Оптимальное соотношение площади и стоимости')
        plans = @(@{src="$img/Classic/classic_plan.webp"; name='Вариант 1'; meta='100 м² · 3 спальни · 2 санузла'})
        facades = @(
            @{src="$img/Classic/classic1.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Classic/classic.webp"; name='Общий вид'; side='front'},
            @{src="$img/Classic/classic2.webp"; name='Боковой вид'; side='left'},
            @{src="$img/Classic/classic3.webp"; name='Дворовый вид'; side='back'}
        )
    },
    @{
        dir = 'classic\classic-74'; title = 'Classic 74'; arch = 'Classic'; archHref = '../'
        lead = 'Компактный одноэтажный дом для пары или небольшой семьи'
        area = '74 м²'; beds = '2'; baths = '1'; floors = '1 этаж'; terrace = 'Крытая терраса'
        hero = "$img/Классик 74/front.webp"
        price = '≈ 237 000 руб'
        video = ''
        overview = 'Classic 74 — младшая версия линейки современной классики. Кухня-гостиная с выходом на крытую террасу, две спальни, санузел и котельная-постирочная. Светлый фасад, графитовая кровля и тёмные окна.'
        points = @('Без лестниц','Две изолированные спальни','Выход на террасу','Компактное пятно застройки','Светлый фасад','Подходит для узкого участка')
        plans = @(@{src="$img/Классик 74/Plan.webp"; name='Планировка'; meta='74 м² · 2 спальни · 1 санузел'})
        facades = @(
            @{src="$img/Классик 74/front.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Классик 74/Back.webp"; name='Задний фасад'; side='back'},
            @{src="$img/Классик 74/Left.webp"; name='Левый фасад'; side='left'},
            @{src="$img/Классик 74/Right.webp"; name='Правый фасад'; side='right'}
        )
    },
    @{
        dir = 'classic\classic-148'; title = 'Classic 148'; arch = 'Classic'; archHref = '../'
        lead = 'Двухэтажный коттедж для комфортной жизни семьи за городом'
        area = '148 м²'; beds = '3'; baths = '2'; floors = '2 этажа'; terrace = 'Терраса 24 м²'
        hero = "$img/Классик 148/Front.webp"
        price = '≈ 483 000 руб'
        video = ''
        overview = 'На первом этаже — кухня-гостиная 36 м² с выходом на террасу, кабинет, санузел, гардероб и котельная. На втором — три спальни, ванная и гардеробная. Светлый фасад, графитовая кровля и каменный цоколь.'
        points = @('Кухня-гостиная 36 м²','Кабинет на первом этаже','Три спальни на втором','Крытая терраса','Гардеробные','Современная классика')
        plans = @()
        facades = @(
            @{src="$img/Классик 148/Front.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Классик 148/back.webp"; name='Задний фасад'; side='back'},
            @{src="$img/Классик 148/Left.webp"; name='Левый фасад'; side='left'},
            @{src="$img/Классик 148/Rigth.webp"; name='Правый фасад'; side='right'}
        )
    },
    @{
        dir = 'classic\classic-cottage'; title = 'Классический коттедж'; arch = 'Classic'; archHref = '../'
        lead = 'Классический загородный дом с спокойными пропорциями'
        area = '120 м²'; beds = '3'; baths = '2'; floors = '2 этажа'; terrace = 'Терраса'
        hero = "$img/Classic/classic.webp"
        price = '≈ 189 000 руб'
        video = ''
        overview = 'Классический коттедж для семьи, которой нужна привычная архитектура и понятная планировка. Дом можно адаптировать по площади, фасаду и составу комнат под ваш участок.'
        points = @('Привычная классическая форма','Три спальни','Два санузла','Терраса','Адаптация фасада','Строительство под ключ')
        plans = @(@{src="$img/Classic/classic_plan.webp"; name='Планировка'; meta='3 спальни · 2 санузла'})
        facades = @(
            @{src="$img/Classic/classic.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Classic/classic1.webp"; name='Ракурс 2'; side='left'},
            @{src="$img/Classic/classic2.webp"; name='Ракурс 3'; side='right'},
            @{src="$img/Classic/classic3.webp"; name='Дворовый вид'; side='back'}
        )
    },
    @{
        dir = 'barn\barn-140'; title = 'Barn 140'; arch = 'Barn'; archHref = '../'
        lead = 'Двухэтажный барнхаус с панорамным остеклением'
        area = '140 м²'; beds = '4'; baths = '2'; floors = '2 этажа'; terrace = 'Терраса'
        hero = "$img/Barn Terrase/Front.webp"
        price = '≈ 438 000 руб'
        video = ''
        overview = 'Пятно застройки 70 м², общая площадь 140 м². Вытянутый объём, двускатная крыша, деревянный планкен и панорамное остекление. На втором этаже — мастер-спальня, две спальни и кабинет.'
        points = @('Мастер-спальня','Кабинет','Два санузла','Панорамное остекление','Кухня-гостиная 31,5 м²','Семья 4–6 человек')
        plans = @(
            @{src="$img/Barn Terrase/1Level.webp"; name='1 этаж'; meta='Кухня-гостиная, спальня, санузел'},
            @{src="$img/Barn Terrase/2Level.webp"; name='2 этаж'; meta='Мастер-спальня, кабинет, санузел'}
        )
        facades = @(
            @{src="$img/Barn Terrase/Front.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Barn Terrase/Back.webp"; name='Задний фасад'; side='back'},
            @{src="$img/Barn Terrase/Left.webp"; name='Левый фасад'; side='left'},
            @{src="$img/Barn Terrase/Right.webp"; name='Правый фасад'; side='right'}
        )
    },
    @{
        dir = 'barn\barnhouse'; title = 'Современный барнхаус'; arch = 'Barn'; archHref = '../'
        lead = 'Лаконичный барнхаус с выразительной кровлей'
        area = '100 м²'; beds = '3'; baths = '2'; floors = '2 этажа'; terrace = 'Терраса'
        hero = "$img/Barn/barn.webp"
        price = '≈ 243 000 руб'
        video = ''
        overview = 'Современный барнхаус с простым объёмом и высокой двускатной кровлей. Планировка делится на дневную зону и спальни, дом хорошо садится на участок средней площади.'
        points = @('Выразительная кровля','Три спальни','Два санузла','Терраса','Панорамные окна','Лаконичный фасад')
        plans = @(
            @{src="$img/Barn/barn_plan1.webp"; name='Планировка 1'; meta='1 этаж'},
            @{src="$img/Barn/barn_plan2.webp"; name='Планировка 2'; meta='2 этаж'}
        )
        facades = @(
            @{src="$img/Barn/barn.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Barn/barn1.webp"; name='Ракурс 2'; side='left'},
            @{src="$img/Barn/barn2.webp"; name='Ракурс 3'; side='right'},
            @{src="$img/Barn/barn3.webp"; name='Дворовый вид'; side='back'}
        )
    },
    @{
        dir = 'minimalism\classic-second-light'; title = 'Classic со вторым светом'; arch = 'Minimalism'; archHref = '../'
        lead = 'Дом со вторым светом и спокойной геометрией'
        area = '160 м²'; beds = '3'; baths = '2'; floors = '2 этажа'; terrace = 'Терраса'
        hero = "$img/Classic_2/project1.webp"
        price = '≈ 200 000 руб'
        video = 'https://youtu.be/XwDCS3asd30'
        overview = 'Дом со вторым светом: высокая гостиная, много дневного света и современная геометрия фасада. Подходит семье, которой важно ощущение простора в общей зоне.'
        points = @('Второй свет','Высокая гостиная','Три спальни','Современный фасад','Терраса','Видеообзор объекта')
        plans = @()
        facades = @(
            @{src="$img/Classic_2/project1.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Classic_2/project2.webp"; name='Ракурс 2'; side='left'},
            @{src="$img/Classic_2/project3.webp"; name='Ракурс 3'; side='right'},
            @{src="$img/Classic_2/project4.webp"; name='Интерьер'; side='back'}
        )
    },
    @{
        dir = 'chalet\alpine-chalet'; title = 'Альпийское шале'; arch = 'Chalet'; archHref = '../'
        lead = 'Дом с выразительной кровлей и связью с участком'
        area = '220 м²'; beds = '4'; baths = '3'; floors = '2 этажа'; terrace = 'Терраса'
        hero = "$img/Shale_black/shale_black.webp"
        price = '≈ 613 000 руб'
        video = ''
        overview = 'Альпийское шале с широкой кровлей, тёплым фасадом и большой общей зоной. Дом рассчитан на семью, которой нужны несколько спален и выраженная связь интерьера с участком.'
        points = @('Выразительная кровля','Четыре спальни','Три санузла','Терраса','Мастер-спальня','Связь с природой')
        plans = @(
            @{src="$img/Shale_black/shale_black_plan1.webp"; name='Планировка 1'; meta='1 этаж'},
            @{src="$img/Shale_black/shale_black_plan2.webp"; name='Планировка 2'; meta='2 этаж'}
        )
        facades = @(
            @{src="$img/Shale_black/shale_black.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Shale_black/shale_black_1.webp"; name='Ракурс 2'; side='left'}
        )
    },
    @{
        dir = 'chalet\chalet-white'; title = 'Шале White'; arch = 'Chalet'; archHref = '../'
        lead = 'Светлое шале с широкой кровлей'
        area = '180 м²'; beds = '4'; baths = '2'; floors = '2 этажа'; terrace = 'Терраса'
        hero = "$img/Shale_white/shale_white.webp"
        price = '≈ 503 000 руб'
        video = ''
        overview = 'Шале White — светлый вариант альпийского дома: широкая кровля, спокойный фасад и планировка с несколькими спальнями. Дом хорошо читается на участке с деревьями.'
        points = @('Светлый фасад','Четыре спальни','Два санузла','Терраса','Мастер-спальня','Широкая кровля')
        plans = @(
            @{src="$img/Shale_white/shale_white_plan.webp"; name='Планировка 1'; meta='1 этаж'},
            @{src="$img/Shale_white/shale_white_plan2.webp"; name='Планировка 2'; meta='2 этаж'}
        )
        facades = @(
            @{src="$img/Shale_white/shale_white.webp"; name='Главный фасад'; side='front'},
            @{src="$img/Shale_white/shale_white1.webp"; name='Ракурс 2'; side='left'}
        )
    }
)

$pointIcons = @('fa-th-large','fa-sun','fa-umbrella-beach','fa-home','fa-map-marked-alt','fa-balance-scale')

foreach ($h in $houses) {
    $pi = 0
    $points = ($h.points | ForEach-Object {
        $icon = $pointIcons[$pi % $pointIcons.Count]
        $pi++
        "<li><span class=`"house-points__icon`"><i class=`"fas $icon`" aria-hidden=`"true`"></i></span><span>$_</span></li>"
    }) -join ''
    $plans = ''
    if ($h.plans.Count -eq 0) {
        $plans = '<p>Планировки этого проекта готовим к публикации. Оставьте заявку — пришлём актуальные варианты.</p>'
    } else {
        $i = 1
        foreach ($p in $h.plans) {
            $src = Img $p.src
            $plans += "<a class=`"plan-card`" href=`"$src`"><img src=`"$src`" alt=`"$($h.title): $($p.name)`" loading=`"lazy`"><div class=`"plan-card__body`"><div><h3>$($p.name)</h3><p>$($p.meta)</p></div><span class=`"plan-card__go`" aria-hidden=`"true`"><i class=`"fas fa-arrow-right`"></i></span></div></a>"
            $i++
        }
    }
    $facades = ''
    foreach ($f in $h.facades) {
        $src = Img $f.src
        $facades += "<figure class=`"facade-card`" data-side=`"$($f.side)`"><img src=`"$src`" alt=`"$($h.title): $($f.name)`" loading=`"lazy`"><figcaption>$($f.name)</figcaption></figure>"
    }
    $hero = Img $h.hero
    $videoBtn = if ($h.video) {
        "<a class=`"house-btn house-btn--ghost`" href=`"$($h.video)`" target=`"_blank`" rel=`"noopener`"><i class=`"fas fa-play`"></i> Видео о проекте</a>"
    } else {
        '<a class="house-btn house-btn--ghost" href="#tour"><i class="fas fa-play"></i> 3D-тур</a>'
    }
    $tourAction = if ($h.video) {
        "<a class=`"house-btn house-btn--gold`" href=`"$($h.video)`" target=`"_blank`" rel=`"noopener`"><i class=`"fas fa-play`"></i> Смотреть видео</a>"
    } else {
        '<a class="house-btn house-btn--gold" href="#plans"><i class="fas fa-play"></i> Смотреть планировки</a>'
    }
    $n = @($h.plans).Count
    $planWord = if ($n % 10 -eq 1 -and $n % 100 -ne 11) { 'вариант' } elseif ($n % 10 -ge 2 -and $n % 10 -le 4 -and ($n % 100 -lt 12 -or $n % 100 -gt 14)) { 'варианта' } else { 'вариантов' }
    $planCount = if ($n) { "$n $planWord" } else { 'готовим' }
    $html = @"
<!DOCTYPE html>
<html lang="ru">
<head>
    <script>window.dataLayer = window.dataLayer || [];</script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MDM9B4MX');</script>
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "wjjglyal80");
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$($h.title) — проект дома | TOP BUILDING</title>
    <meta name="description" content="$($h.title): $($h.lead). Площадь $($h.area), $($h.beds) спальни, $($h.floors).">
    <link rel="canonical" href="https://topbuilding.by/projects/$($h.dir.Replace('\','/'))/">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../../../style.css?v=179">
    <link rel="stylesheet" href="../../house.css?v=4">
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Главная","item":"https://topbuilding.by/"},
      {"@type":"ListItem","position":2,"name":"Проекты","item":"https://topbuilding.by/projects/"},
      {"@type":"ListItem","position":3,"name":"$($h.title)","item":"https://topbuilding.by/projects/$($h.dir.Replace('\','/'))/"}
    ]}
    </script>
</head>
<body class="projects-page house-page">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MDM9B4MX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<div class="maklknknin-content-wrapper">
<header class="header" id="mainHeader">
  <div class="container"><nav class="nav">
    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Открыть меню"><span></span><span></span><span></span></button>
    <div class="nav-left"><a href="../../../index.html" class="logo-link"><div class="header-logo"><svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg><div class="logo-text"><span class="logo-top">ТОП</span><span class="logo-building">БИЛДИНГ</span></div></div></a></div>
    <div class="nav-logo-center"><a href="../../../index.html" class="logo-link"><div class="header-logo"><svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg><div class="logo-text"><span class="logo-top">ТОП</span><span class="logo-building">БИЛДИНГ</span></div></div></a></div>
    <div class="nav-menu">
      <ul><li><a href="../../../index.html">Главная</a><ul><li><a href="../../../index.html#home">Главная страница</a></li><li><a href="../../../index.html#calculator">Калькулятор стоимости</a></li><li><a href="../../../about/about.html#about">Почему выбирают нас</a></li><li><a href="../../../index.html#youtube">Мы на YouTube</a></li><li><a href="../../../index.html#our-projects">Наши проекты</a></li><li><a href="../../../index.html#tour-section">Экскурсия по объектам</a></li><li><a href="../../../index.html#workflow">Как мы работаем</a></li><li><a href="../../../index.html#yandex-map">Карта объектов</a></li><li><a href="../../../index.html#testimonials">Отзывы клиентов</a></li><li><a href="#footer">Контакты</a></li></ul></li></ul>
      <ul><li class="active"><a href="../../">Проекты</a><ul><li><a href="../../">Все проекты</a></li><li><a href="../../classic/">Classic</a></li><li><a href="../../barn/">Barn</a></li><li><a href="../../minimalism/">Minimalism</a></li><li><a href="../../chalet/">Chalet</a></li></ul></li></ul>
      <ul><li><a href="../../../design/design.html">Проектирование</a><ul><li><a href="../../../design/design.html#design-types">Виды проектов</a></li><li><a href="../../../design/design.html#design-process">Процесс проектирования</a></li><li><a href="../../../design/design.html#prices">Стоимость</a></li><li><a href="../../../design/design.html#popular-projects">Популярные проекты</a></li><li><a href="../../../design/design.html#faq">Вопросы и ответы</a></li></ul></li></ul>
      <ul><li><a href="../../../index.html#workflow">Строительство</a></li></ul>
      <ul><li><a href="../../../news/news.html">Новости</a></li></ul>
      <ul><li><a href="../../../about/about.html">О нас</a><ul><li><a href="../../../about/about.html#about">Почему выбирают нас</a></li><li><a href="../../../about/about.html#testimonials">Отзывы клиентов</a></li><li><a href="../../../about/about.html#documents">Документы</a></li></ul></li></ul>
      <ul><li><a href="#footer">Контакты</a></li></ul>
    </div>
    <button class="contact-toggle-btn" id="contactToggleBtn" type="button"><i class="fas fa-phone-alt"></i><span class="contact-btn-text">Контакты</span></button>
  </nav>
  <div class="mobile-menu" id="mobileMenu"><div class="mobile-menu-content">
    <a href="../../../index.html" class="mobile-menu-link">Главная</a>
    <a href="../../" class="mobile-menu-link active">Проекты</a>
    <a href="../../../design/design.html" class="mobile-menu-link">Проектирование</a>
    <a href="../../../index.html#workflow" class="mobile-menu-link">Строительство</a>
    <a href="../../../news/news.html" class="mobile-menu-link">Новости</a>
    <a href="../../../about/about.html" class="mobile-menu-link">О нас</a>
    <a href="#footer" class="mobile-menu-link">Контакты</a>
  </div></div>
  </div>
</header>
<main class="main">
  <div class="breadcrumbs-wrap"><div class="house-wrap">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
      <a href="../../../index.html">Главная</a>
      <span class="breadcrumbs__sep">›</span>
      <a href="../../">Проекты</a>
      <span class="breadcrumbs__sep">›</span>
      <a href="$($h.archHref)">$($h.arch)</a>
      <span class="breadcrumbs__sep">›</span>
      <span class="breadcrumbs__current">$($h.title)</span>
    </nav>
  </div></div>
  <section class="house-hero" aria-label="$($h.title)">
    <div class="house-hero__bg"><img src="$hero" alt="$($h.title)"><div class="house-hero__shade"></div></div>
    <div class="house-wrap"><div class="house-hero__inner">
      <h1 class="house-hero__title">$($h.title)</h1>
      <p class="house-hero__lead">$($h.lead)</p>
      <ul class="house-stats">
        <li><i class="fas fa-vector-square"></i><div><strong>$($h.area)</strong><span>площадь дома</span></div></li>
        <li><i class="fas fa-bed"></i><div><strong>$($h.beds)</strong><span>спальни</span></div></li>
        <li><i class="fas fa-bath"></i><div><strong>$($h.baths)</strong><span>санузла</span></div></li>
        <li><i class="fas fa-layer-group"></i><div><strong>$($h.floors)</strong><span>этажность</span></div></li>
        <li><i class="fas fa-umbrella-beach"></i><div><strong>$($h.terrace)</strong><span>особенность</span></div></li>
      </ul>
      <div class="house-hero__actions">
        <a class="house-btn house-btn--gold" href="#plans">Посмотреть планировки <i class="fas fa-arrow-right"></i></a>
        $videoBtn
      </div>
    </div></div>
  </section>
  <nav class="house-nav" aria-label="Разделы проекта">
    <div class="house-wrap house-nav__row">
      <a class="house-nav__link is-active" href="#overview">Обзор</a>
      <a class="house-nav__link" href="#plans">Планировки</a>
      <a class="house-nav__link" href="#tour">3D-тур</a>
      <a class="house-nav__link" href="#facades">Фасады</a>
      <a class="house-nav__link" href="#specs">Характеристики</a>
      <a class="house-nav__link" href="#packages">Комплектации</a>
      <a class="house-nav__link" href="#faq">Вопросы</a>
      <button type="button" class="house-btn house-btn--gold house-nav__cta open-sidebar-btn" onclick="openContactSidebar()">Получить консультацию</button>
    </div>
  </nav>
  <section class="house-section" id="overview"><div class="house-wrap house-overview">
    <div>
      <h2>Продуманная планировка для всей семьи</h2>
      <p>$($h.overview)</p>
    </div>
    <ul class="house-points">$points</ul>
  </div></section>
  <section class="house-section" id="plans"><div class="house-wrap">
    <div class="house-head"><h2>Варианты планировок</h2><span class="house-count">$planCount</span></div>
    <div class="plan-grid">$plans</div>
  </div></section>
  <section class="house-section" id="tour"><div class="house-wrap">
    <div class="house-tour">
      <div>
        <h2>Интерактивный 3D-тур по дому $($h.title)</h2>
        <p>Посмотрите дом и планировку в спокойном темпе. Если тур ещё монтируется, откроем актуальные планировки и ответим на вопросы по комплектации.</p>
        $tourAction
      </div>
      <div class="house-tour__media"><img src="$hero" alt="3D-тур $($h.title)" loading="lazy"><span class="house-play" aria-hidden="true"><i class="fas fa-play"></i></span></div>
    </div>
  </div></section>
  <section class="house-section" id="facades"><div class="house-wrap">
    <div class="house-head"><h2>Фасады дома</h2></div>
    <div class="facade-tabs">
      <button type="button" class="is-active" data-side="all">Все стороны</button>
      <button type="button" data-side="front">Главный</button>
      <button type="button" data-side="back">Задний</button>
      <button type="button" data-side="left">Левая</button>
      <button type="button" data-side="right">Правая</button>
    </div>
    <div class="facade-grid">$facades</div>
  </div></section>
  <section class="house-section" id="specs"><div class="house-wrap house-specs">
    <div>
      <h2>Основные характеристики</h2>
      <div class="spec-grid">
        <div class="spec-item"><i class="fas fa-vector-square"></i><div><strong>$($h.area)</strong><span>Полезная площадь</span></div></div>
        <div class="spec-item"><i class="fas fa-bed"></i><div><strong>$($h.beds)</strong><span>Спальни</span></div></div>
        <div class="spec-item"><i class="fas fa-bath"></i><div><strong>$($h.baths)</strong><span>Санузлы</span></div></div>
        <div class="spec-item"><i class="fas fa-layer-group"></i><div><strong>$($h.floors)</strong><span>Этажность</span></div></div>
        <div class="spec-item"><i class="fas fa-umbrella-beach"></i><div><strong>$($h.terrace)</strong><span>Терраса</span></div></div>
        <div class="spec-item"><i class="fas fa-home"></i><div><strong>$($h.arch)</strong><span>Архитектурный стиль</span></div></div>
      </div>
    </div>
    <aside class="consult-card" style="--consult:url('$hero')">
      <h3>Получить подробную консультацию по проекту</h3>
      <p>Ответим на вопросы, поможем выбрать планировку и рассчитаем стоимость строительства.</p>
      <button type="button" class="house-btn house-btn--gold open-sidebar-btn" onclick="openContactSidebar()">Обсудить проект <i class="fas fa-arrow-right"></i></button>
    </aside>
  </div></section>
  <section class="house-section" id="packages"><div class="house-wrap">
    <h2>Комплектации</h2>
    <div class="pack-grid">
      <article class="pack-card"><h3>Коробка</h3><p>Фундамент, стены, кровля, окна и наружный контур дома.</p></article>
      <article class="pack-card"><h3>Черновая</h3><p>Стяжка, штукатурка и внутренняя разводка инженерных сетей.</p></article>
      <article class="pack-card"><h3>Под ключ</h3><p>Дом, в который можно заезжать: отделка и инженерия по согласованной смете.</p><strong>$($h.price)</strong></article>
    </div>
  </div></section>
  <section class="house-section" id="faq"><div class="house-wrap">
    <h2>Вопросы</h2>
    <div class="faq-list">
      <article class="faq-item"><h3>Можно изменить планировку $($h.title)?</h3><p>Да. Сдвигаем перегородки, число спален и размер террасы под состав семьи и участок.</p></article>
      <article class="faq-item"><h3>Цена на странице окончательная?</h3><p>Это ориентир под ключ. Точная смета считается после геологии, проекта и выбранной комплектации.</p></article>
      <article class="faq-item"><h3>Есть ли 3D-планировки?</h3><p>Новые проекты и 3D-планировки добавляем каждую неделю. Актуальный комплект пришлём после заявки.</p></article>
    </div>
  </div></section>
  <div class="hero-sidebar" id="heroSidebar">
    <div class="hero-contact-card">
      <div class="hero-contact-card__backdrop" aria-hidden="true">
        <img src="../../../main_img/Cast/Oleg.webp" alt="" class="hero-contact-card__photo" decoding="async">
        <div class="hero-contact-card__shade"></div>
      </div>
      <button class="sidebar-close-btn" id="sidebarCloseBtn" type="button"><i class="fas fa-times"></i></button>
      <div class="hero-contact-card__body">
        <div class="ceo-highlight ceo-highlight--sidebar">
          <div class="ceo-info">
            <div class="ceo-name">Гриценко Олег Олегович</div>
            <div class="ceo-title"><i class="fas fa-circle ceo-online-dot" aria-hidden="true"></i> Руководитель компании</div>
          </div>
        </div>
        <a href="tel:+375291286217" class="sidebar-phone-link">+375 (29) 128-62-17</a>
        <div class="contact-info-footer">
          <p><i class="fas fa-envelope"></i> <a href="mailto:topbuilding.by@gmail.com">topbuilding.by@gmail.com</a></p>
          <p><i class="fas fa-clock"></i> Ежедневно 9:00 - 21:00</p>
          <p class="sidebar-note">24/7 оставьте заявку — мы свяжемся в рабочее время</p>
        </div>
        <div class="hero-contact-buttons">
          <a href="#" class="contact-btn primary-contact" data-source="Страница $($h.title)"><i class="fas fa-phone-alt"></i><span>Заказать звонок</span></a>
          <div class="messenger-buttons">
            <a href="https://t.me/+375291286217" class="messenger-btn telegram"><i class="fab fa-telegram-plane"></i><span>Telegram</span></a>
            <a href="viber://chat/?number=%2B375291286217" class="messenger-btn viber"><i class="fab fa-viber"></i><span>Viber</span></a>
            <a href="https://wa.me/375291286217" class="messenger-btn whatsapp"><i class="fab fa-whatsapp"></i><span>WhatsApp</span></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
<footer id="footer" class="footer">
  <div class="footer-container">
    <div class="footer-grid">
      <div class="footer-col">
        <div class="footer-logo">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <div class="logo-text"><span class="logo-top">ТОП</span><span class="logo-building">БИЛДИНГ</span></div>
        </div>
        <p>ООО "ТОПБИЛДИНГ" - проектирование и строительство домов под ключ в Республике Беларусь.</p>
      </div>
      <div class="footer-col">
        <h4>Меню</h4>
        <ul class="footer-menu">
          <li><a href="../../">Проекты домов</a></li>
          <li><a href="../../classic/">Classic</a></li>
          <li><a href="../../barn/">Barn</a></li>
          <li><a href="../../minimalism/">Minimalism</a></li>
          <li><a href="../../chalet/">Chalet</a></li>
          <li><a href="../../../index.html#calculator">Калькулятор стоимости</a></li>
          <li><a href="../../../index.html#testimonials">Отзывы клиентов</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Услуги</h4>
        <ul class="footer-services">
          <li><a href="../../../design/design.html">Проектирование</a></li>
          <li><a href="../../../news/news.html">Новости</a></li>
          <li><a href="../../../partners/partners.html">Партнеры</a></li>
          <li><a href="../../../about/about.html">О нас</a></li>
          <li><a href="../../../administrative/administrative.html">Административные и производственные сооружения</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Контакты</h4>
        <address>
          <p><i class="fas fa-phone"></i> <a href="tel:+375291286217">+375 (29) 128-62-17</a></p>
          <p><i class="fas fa-envelope"></i> <a href="mailto:topbuilding.by@gmail.com">topbuilding.by@gmail.com</a></p>
          <p><i class="fas fa-clock"></i> Ежедневно 9:00 - 21:00</p>
        </address>
        <div class="footer-social">
          <a href="https://www.youtube.com/@TopBuildingBY" class="social-icon" title="Мы на YouTube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
          <a href="https://t.me/+375291286217" class="social-icon" target="_blank" rel="noopener"><i class="fab fa-telegram-plane"></i></a>
          <a href="viber://chat/?number=%2B375291286217" class="social-icon"><i class="fab fa-viber"></i></a>
          <a href="https://wa.me/375291286217" class="social-icon" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i></a>
        </div>
        <button class="btn footer-btn open-sidebar-btn" onclick="openContactSidebar()"><i class="fas fa-phone-alt"></i><span>Заказать звонок</span></button>
      </div>
    </div>
    <div class="footer-bottom"><p>&copy; 2026 ООО «ТОПБИЛДИНГ». Все права защищены.</p></div>
  </div>
</footer>
</div>
<script src="../../../js/site-common.js" defer></script>
<script src="../../../js/contact-sidebar.js" defer></script>
<script src="../../../config.js"></script>
<script src="../../house.js?v=1" defer></script>
</body>
</html>
"@
    $out = Join-Path $root ($h.dir + '\index.html')
    New-Item -ItemType Directory -Force -Path (Split-Path $out) | Out-Null
    [System.IO.File]::WriteAllText($out, $html, [System.Text.UTF8Encoding]::new($false))
    Write-Output $out
}
