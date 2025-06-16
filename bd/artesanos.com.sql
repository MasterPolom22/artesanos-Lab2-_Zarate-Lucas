-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-06-2025 a las 04:00:53
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `artesanos.com`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album`
--

CREATE TABLE `album` (
  `id_album` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `tipo` enum('normal','compartido') DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `album`
--

INSERT INTO `album` (`id_album`, `id_usuario`, `titulo`, `fecha_creacion`, `tipo`) VALUES
(49, 53, 'paralelismo', '2025-06-15 22:57:40', 'normal'),
(50, 55, 'batimovil', '2025-06-15 22:58:30', 'normal'),
(51, 54, 'Comics', '2025-06-15 22:59:40', 'normal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amistad`
--

CREATE TABLE `amistad` (
  `id_amistad` int(11) NOT NULL,
  `id_solicitante` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `estado` enum('pendiente','aceptada','rechazada') DEFAULT 'pendiente',
  `fecha_solicitud` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `amistad`
--

INSERT INTO `amistad` (`id_amistad`, `id_solicitante`, `id_destinatario`, `estado`, `fecha_solicitud`) VALUES
(34, 53, 54, 'aceptada', '2025-06-15 22:57:53'),
(35, 53, 55, 'aceptada', '2025-06-15 22:57:54'),
(36, 54, 55, 'aceptada', '2025-06-15 23:00:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id_comentario` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `texto` text NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id_comentario`, `id_imagen`, `id_usuario`, `texto`, `fecha`) VALUES
(7, 93, 55, 'Muy buena lucas!', '2025-06-15 22:58:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compartir`
--

CREATE TABLE `compartir` (
  `id_compartir` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `id_usuario_destino` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadistica_opc`
--

CREATE TABLE `estadistica_opc` (
  `id_usuario` int(11) NOT NULL,
  `cantidad_imagenes` int(11) DEFAULT 0,
  `cantidad_comentarios_recibidos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento_opc`
--

CREATE TABLE `evento_opc` (
  `id_evento` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_evento` date DEFAULT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `creado_por` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

CREATE TABLE `imagen` (
  `id_imagen` int(11) NOT NULL,
  `id_album` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_subida` datetime DEFAULT current_timestamp(),
  `compartida` tinyint(1) DEFAULT 0,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id_imagen`, `id_album`, `url`, `titulo`, `descripcion`, `fecha_subida`, `compartida`, `id_usuario`) VALUES
(93, 49, '/uploads/imagen-1750039069567-850017507.jpg', 'aaaaa', 'aaaaaaaaaaaaa', '2025-06-15 22:57:49', 1, 53),
(94, 50, '/uploads/imagen-1750039123799-811607401.jpg', 'batbati', 'aaaaaaaaaaaaa', '2025-06-15 22:58:43', 1, 55),
(95, 51, '/uploads/imagen-1750039195981-188742341.jpg', 'com', 'jajajaajaj', '2025-06-15 22:59:55', 1, 54);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen_tag`
--

CREATE TABLE `imagen_tag` (
  `id_imagen` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` enum('comentario','amistad') NOT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte_opc`
--

CREATE TABLE `reporte_opc` (
  `id_reporte` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `motivo` text NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE `tag` (
  `id_tag` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `imagen_perfil` varchar(255) DEFAULT NULL,
  `intereses` text DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `modo_portafolio` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `contraseña`, `imagen_perfil`, `intereses`, `antecedentes`, `fecha_registro`, `modo_portafolio`) VALUES
(53, 'Lucas ', 'peperi', 'aaa@gmail.com', '$2b$10$fCFmQC9TyBUC4b3Bv.KZ/Oj4/HR2hs72KaF4/RUTFqyphxThCzIOe', '/uploads/imagen_perfil-1750039053394-569458922.jpg', '123', 'ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', '2025-06-14 23:47:41', 0),
(54, 'Clark', 'Ken', 'superman@gmail.com', '$2b$10$qX3H9uGt6P2vm6iznbUUwOxVHax8huEkZkMtlYgDimsfDtC5vidXq', '/uploads/imagen_perfil-1750039167693-490703815.jpg', 'salvar al mundo', 'alienigena perdido', '2025-06-15 00:28:56', 0),
(55, 'Bruno', 'Diaz', 'batman@gmail.com', '$2b$10$nFg3UDopUeKWD2j3XG1vLOUZswD13359aHS8KJcR0Gxf7rt8U/Axi', '/uploads/imagen_perfil-1750039099959-251575712.jpg', 'ciudad gothica', 'entrenamiento en el arte ninja', '2025-06-15 00:33:22', 0),
(56, 'Eze', 'Zarate', 'bbb@gmail.com', '$2b$10$Oik2kOnL0Au.mZrXjnhoGuDqHod/.qek2HbwAarUPtSMxSkuZwJny', '/uploads/imagen_perfil-1750034524456-387892876.jpg', 'peliculas de guerra', 'actor', '2025-06-16 02:42:04', 0),
(57, 'Rambo', 'Jonh', 'rambo@gmail.com', '$2b$10$siphjHdN9HZ27nJCBO6MPujTCF8IfS/QC/Xg5.3NJnLyLg1UdFB6O', '/uploads/imagen_perfil-1750034670007-623114667.jpg', 'peliculas de guerra', 'Rocky 1, 2, 3', '2025-06-16 02:44:30', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_evento`
--

CREATE TABLE `usuario_evento` (
  `id_usuario` int(11) NOT NULL,
  `id_evento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id_album`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `amistad`
--
ALTER TABLE `amistad`
  ADD PRIMARY KEY (`id_amistad`),
  ADD KEY `id_solicitante` (`id_solicitante`),
  ADD KEY `id_destinatario` (`id_destinatario`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `id_imagen` (`id_imagen`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `compartir`
--
ALTER TABLE `compartir`
  ADD PRIMARY KEY (`id_compartir`),
  ADD KEY `id_imagen` (`id_imagen`),
  ADD KEY `id_usuario_destino` (`id_usuario_destino`);

--
-- Indices de la tabla `estadistica_opc`
--
ALTER TABLE `estadistica_opc`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `evento_opc`
--
ALTER TABLE `evento_opc`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `creado_por` (`creado_por`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_album` (`id_album`),
  ADD KEY `fk_imagen_usuario` (`id_usuario`);

--
-- Indices de la tabla `imagen_tag`
--
ALTER TABLE `imagen_tag`
  ADD PRIMARY KEY (`id_imagen`,`id_tag`),
  ADD KEY `id_tag` (`id_tag`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `reporte_opc`
--
ALTER TABLE `reporte_opc`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_imagen` (`id_imagen`);

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id_tag`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `usuario_evento`
--
ALTER TABLE `usuario_evento`
  ADD PRIMARY KEY (`id_usuario`,`id_evento`),
  ADD KEY `id_evento` (`id_evento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `album`
--
ALTER TABLE `album`
  MODIFY `id_album` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `amistad`
--
ALTER TABLE `amistad`
  MODIFY `id_amistad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `compartir`
--
ALTER TABLE `compartir`
  MODIFY `id_compartir` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evento_opc`
--
ALTER TABLE `evento_opc`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reporte_opc`
--
ALTER TABLE `reporte_opc`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `id_tag` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `album_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `amistad`
--
ALTER TABLE `amistad`
  ADD CONSTRAINT `amistad_ibfk_1` FOREIGN KEY (`id_solicitante`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `amistad_ibfk_2` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`),
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `compartir`
--
ALTER TABLE `compartir`
  ADD CONSTRAINT `compartir_ibfk_1` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`),
  ADD CONSTRAINT `compartir_ibfk_2` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `estadistica_opc`
--
ALTER TABLE `estadistica_opc`
  ADD CONSTRAINT `estadistica_opc_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `evento_opc`
--
ALTER TABLE `evento_opc`
  ADD CONSTRAINT `evento_opc_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `fk_imagen_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `imagen_ibfk_1` FOREIGN KEY (`id_album`) REFERENCES `album` (`id_album`);

--
-- Filtros para la tabla `imagen_tag`
--
ALTER TABLE `imagen_tag`
  ADD CONSTRAINT `imagen_tag_ibfk_1` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`),
  ADD CONSTRAINT `imagen_tag_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id_tag`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `reporte_opc`
--
ALTER TABLE `reporte_opc`
  ADD CONSTRAINT `reporte_opc_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `reporte_opc_ibfk_2` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id_imagen`);

--
-- Filtros para la tabla `usuario_evento`
--
ALTER TABLE `usuario_evento`
  ADD CONSTRAINT `usuario_evento_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `usuario_evento_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `evento_opc` (`id_evento`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
