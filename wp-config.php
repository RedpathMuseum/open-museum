<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link https://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'open-museum');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '@Mf${>Z9H+TpbdGWVq?-9MulW:)qw+(A${9b=j;i-~Cv2Og(|vFj#>U?xho?P[`;');
define('SECURE_AUTH_KEY',  'yYCIE*qzX}~-@+|2m:cgRggI6h[`sF,3Z1.7G1YU-.8uoAgEAz-l!W8R H*zV6iX');
define('LOGGED_IN_KEY',    'z^i=ns-q}{XI>i]kEl:rd|#`]v3BEez^TkD8}{^%-(G:6|/=3?jv}+WtU&oE6nP,');
define('NONCE_KEY',        '|(Expg1A+}?ao1!>$Q.bX|f(0f3y9a|ik()Kh>,t:^+;%tnM=^=*v#_KkgE# LJ)');
define('AUTH_SALT',        'L|p3,YP+D>!r:ZRqf9nPYA!eO2=Ng%/i(m]XNjPW/~VX }1zc^<7%0:z~Vr5gNfl');
define('SECURE_AUTH_SALT', '%nS0l{/E9is&x31s`.@H@IT<LzfSLq?&f>kuV|?OLb4G]B=>Gk{j]nt,>&H[yB@F');
define('LOGGED_IN_SALT',   'SIA}9+.BJoa:d$r:o7<.0]8krv?$(%,$_+y~@AE/FL^>Tal%{2gDQx@)jl5W5F24');
define('NONCE_SALT',       '/Y17J-+7TP^-uLt]W#_b ,bHU+O{$3!n9q_]VickyFfC.%3 E2_Qu@*:vlBX;:,E');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
