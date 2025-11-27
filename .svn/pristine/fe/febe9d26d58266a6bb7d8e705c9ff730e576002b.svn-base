<?php
/**
 * Plugin Name: Site Grayscale Toggle
 * Description: Apply a site-wide grayscale effect with a front-end toggle button so visitors can turn it off/on. Intensity control and option to show/hide the floating button. CSP-safe (no inline JS).
 * Version: 1.1.1
 * Author: natthasath
 * License: GPL2+
 * Text Domain: site-grayscale-toggle
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class SGTGLE_Site_Grayscale_Toggle {

	const OPTION_DEFAULT_ON  = 'sgtgle_default_on';   // bool.
	const OPTION_INTENSITY   = 'sgtgle_intensity';    // int 0..100.
	const OPTION_SHOW_BUTTON = 'sgtgle_show_button';  // bool.

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Add attributes/class to <html> server-side to avoid FOUC and inline JS.
		add_filter( 'language_attributes', array( $this, 'filter_language_attributes' ), 20, 2 );

		// Front-end assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'wp_footer', array( $this, 'maybe_render_toggle' ) );
		add_shortcode( 'grayscale_toggle', array( $this, 'shortcode_toggle' ) );

		// Settings.
		add_action( 'admin_init', array( $this, 'register_setting' ) );
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );

		// Respect setting for auto button via filter.
		add_filter(
			'sgtgle_auto_button',
			function ( $show ) {
				$val = get_option( self::OPTION_SHOW_BUTTON, 1 );
				return (bool) $val;
			}
		);
	}

	/**
	 * Add data-sgt-default and class=is-grayscale to <html> server-side.
	 *
	 * @param string $output  Existing attributes.
	 * @param string $doctype Doctype.
	 *
	 * @return string
	 */
	public function filter_language_attributes( $output, $doctype ) {
		$default_on      = get_option( self::OPTION_DEFAULT_ON, 1 ) ? 'on' : 'off';
		$default_on_attr = esc_attr( $default_on );

		// Ensure data-sgt-default attribute exists and matches current setting.
		if ( false === strpos( $output, 'data-sgt-default=' ) ) {
			$output .= ' data-sgt-default="' . $default_on_attr . '"';
		} else {
			$output = preg_replace(
				'/data-sgt-default="[^"]*"/',
				'data-sgt-default="' . $default_on_attr . '"',
				$output,
				1
			);
		}

		// Add or merge class="is-grayscale" only if default_on is ON.
		if ( 'on' === $default_on ) {
			if ( preg_match( '/class="([^"]*)"/', $output, $matches ) ) {
				$classes = $matches[1];

				if ( false === strpos( $classes, 'is-grayscale' ) ) {
					$classes = trim( $classes . ' is-grayscale' );
					$output  = preg_replace(
						'/class="[^"]*"/',
						'class="' . esc_attr( $classes ) . '"',
						$output,
						1
					);
				}
			} else {
				$output .= ' class="is-grayscale"';
			}
		}

		return $output;
	}

	/**
	 * Enqueue styles and scripts.
	 */
	public function enqueue_assets() {
		// Styles (intensity as CSS variable).
		$handle = 'sgtgle-styles';
		wp_register_style( $handle, false );
		wp_enqueue_style( $handle );

		$int = intval( get_option( self::OPTION_INTENSITY, 100 ) );
		if ( $int < 0 ) {
			$int = 0;
		}
		if ( $int > 100 ) {
			$int = 100;
		}

		// Build inline CSS without heredoc.
		$css  = ':root { --sgt-level: ' . $int . '%; }' . "\n\n";
		$css .= "html.is-grayscale {\n";
		$css .= "\t-webkit-filter: grayscale(var(--sgt-level));\n";
		$css .= "\tfilter: grayscale(var(--sgt-level));\n";
		$css .= "}\n\n";
		$css .= ".sgt-toggle {\n";
		$css .= "\tposition: fixed;\n";
		$css .= "\tright: 1rem;\n";
		$css .= "\tbottom: 1rem;\n";
		$css .= "\tz-index: 99999;\n";
		$css .= "\tdisplay: inline-flex;\n";
		$css .= "\talign-items: center;\n";
		$css .= "\tgap: .5rem;\n";
		$css .= "\tpadding: .6rem .9rem;\n";
		$css .= "\tborder-radius: .75rem;\n";
		$css .= "\tborder: 1px solid rgba(0,0,0,.1);\n";
		$css .= "\tbackground: rgba(255,255,255,.9);\n";
		$css .= "\tbox-shadow: 0 4px 14px rgba(0,0,0,.12);\n";
		$css .= "\tfont-size: .95rem;\n";
		$css .= "\tline-height: 1;\n";
		$css .= "\tcursor: pointer;\n";
		$css .= "\ttext-decoration: none;\n";
		$css .= "\tcolor: inherit;\n";
		$css .= "\tbackdrop-filter: blur(6px);\n";
		$css .= "}\n";
		$css .= ".sgt-toggle:focus { outline: 2px solid #000; outline-offset: 2px; }\n";
		$css .= ".sgt-hidden { display: none !important; }\n\n";
		$css .= "@media (prefers-reduced-motion: reduce) {\n";
		$css .= "\t.sgt-toggle { transition: none !important; }\n";
		$css .= "}\n";

		wp_add_inline_style( $handle, $css );

		// Script – file-based (no inline).
		$src = plugins_url( 'assets/sgt.js', __FILE__ );
		wp_enqueue_script( 'sgtgle-script', $src, array(), '1.1.1', true );

		// Translatable labels.
		wp_localize_script(
			'sgtgle-script',
			'SGTGLE_I18N',
			array(
				'labelOn'  => __( 'Grayscale: ON', 'site-grayscale-toggle' ),
				'labelOff' => __( 'Grayscale: OFF', 'site-grayscale-toggle' ),
			)
		);
	}

	/**
	 * Render default floating toggle in footer (if enabled).
	 */
	public function maybe_render_toggle() {
		$show = apply_filters( 'sgtgle_auto_button', true );
		if ( ! $show ) {
			return;
		}

		$button_html = $this->render_button_html();
		echo wp_kses_post( $button_html );
	}

	/**
	 * Shortcode handler: [grayscale_toggle].
	 *
	 * @param array $atts Shortcode attributes.
	 *
	 * @return string
	 */
	public function shortcode_toggle( $atts = array() ) {
		$atts = shortcode_atts(
			array(
				'label_on'  => __( 'Grayscale: ON', 'site-grayscale-toggle' ),
				'label_off' => __( 'Grayscale: OFF', 'site-grayscale-toggle' ),
				'class'     => '',
			),
			$atts,
			'grayscale_toggle'
		);

		return $this->render_button_html( $atts['label_on'], $atts['label_off'], $atts['class'], true );
	}

	/**
	 * Build the toggle button HTML.
	 *
	 * @param string $label_on    Label when state is ON.
	 * @param string $label_off   Label when state is OFF.
	 * @param string $extra_class Extra classnames.
	 * @param bool   $return      Whether to return or echo.
	 *
	 * @return string|null
	 */
	private function render_button_html( $label_on = null, $label_off = null, $extra_class = '', $return = false ) {
		if ( null === $label_on ) {
			$label_on = __( 'Grayscale: ON', 'site-grayscale-toggle' );
		}
		if ( null === $label_off ) {
			$label_off = __( 'Grayscale: OFF', 'site-grayscale-toggle' );
		}

		$button_html = sprintf(
			'<a href="#" class="sgt-toggle %1$s" data-sgt-toggle="1" aria-pressed="false" aria-label="%2$s" data-label-on="%3$s" data-label-off="%4$s"><span aria-hidden="true">⟷</span><span data-sgt-label>%5$s</span></a>',
			esc_attr( $extra_class ),
			esc_attr__( 'Toggle grayscale', 'site-grayscale-toggle' ),
			esc_attr( $label_on ),
			esc_attr( $label_off ),
			esc_html( $label_on )
		);

		if ( $return ) {
			return $button_html;
		}

		// Echo with escaping for safety.
		echo wp_kses_post( $button_html );
		return null;
	}

	/**
	 * Register plugin settings.
	 */
	public function register_setting() {
		register_setting(
			'sgtgle_settings',
			self::OPTION_DEFAULT_ON,
			array(
				'type'              => 'boolean',
				'sanitize_callback' => function ( $v ) {
					return $v ? 1 : 0;
				},
				'default'           => 1,
			)
		);

		register_setting(
			'sgtgle_settings',
			self::OPTION_INTENSITY,
			array(
				'type'              => 'integer',
				'sanitize_callback' => function ( $v ) {
					$v = intval( $v );
					if ( $v < 0 ) {
						$v = 0;
					}
					if ( $v > 100 ) {
						$v = 100;
					}
					return $v;
				},
				'default'           => 100,
			)
		);

		register_setting(
			'sgtgle_settings',
			self::OPTION_SHOW_BUTTON,
			array(
				'type'              => 'boolean',
				'sanitize_callback' => function ( $v ) {
					return $v ? 1 : 0;
				},
				'default'           => 1,
			)
		);

		add_settings_section(
			'sgtgle_main',
			__( 'Behavior', 'site-grayscale-toggle' ),
			'__return_false',
			'sgtgle_settings'
		);

		add_settings_field(
			'sgtgle_default_on_field',
			__( 'Enable grayscale by default', 'site-grayscale-toggle' ),
			function () {
				$val = get_option( self::OPTION_DEFAULT_ON, 1 );
				printf(
					'<label><input type="checkbox" name="%1$s" value="1" %2$s /> %3$s</label>',
					esc_attr( self::OPTION_DEFAULT_ON ),
					checked( 1, $val, false ),
					esc_html__( 'Checked = ON by default (visitors can still toggle)', 'site-grayscale-toggle' )
				);
			},
			'sgtgle_settings',
			'sgtgle_main'
		);

		add_settings_field(
			'sgtgle_intensity_field',
			__( 'Grayscale intensity (0–100)', 'site-grayscale-toggle' ),
			function () {
				$val = intval( get_option( self::OPTION_INTENSITY, 100 ) );
				if ( $val < 0 ) {
					$val = 0;
				}
				if ( $val > 100 ) {
					$val = 100;
				}
				printf(
					'<input type="number" min="0" max="100" step="1" name="%1$s" value="%2$d" class="small-text" /> <span class="description">%3$s</span>',
					esc_attr( self::OPTION_INTENSITY ),
					$val,
					esc_html__( '0 = no grayscale, 100 = full grayscale', 'site-grayscale-toggle' )
				);
			},
			'sgtgle_settings',
			'sgtgle_main'
		);

		add_settings_field(
			'sgtgle_show_button_field',
			__( 'Show floating toggle button', 'site-grayscale-toggle' ),
			function () {
				$val = get_option( self::OPTION_SHOW_BUTTON, 1 );
				printf(
					'<label><input type="checkbox" name="%1$s" value="1" %2$s /> %3$s</label>',
					esc_attr( self::OPTION_SHOW_BUTTON ),
					checked( 1, $val, false ),
					esc_html__( 'Checked = show button (you can also place [grayscale_toggle] manually)', 'site-grayscale-toggle' )
				);
			},
			'sgtgle_settings',
			'sgtgle_main'
		);
	}

	/**
	 * Add settings page under Settings → Site Grayscale.
	 */
	public function add_settings_page() {
		add_options_page(
			__( 'Site Grayscale', 'site-grayscale-toggle' ),
			__( 'Site Grayscale', 'site-grayscale-toggle' ),
			'manage_options',
			'sgtgle_settings',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Render settings page.
	 */
	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html__( 'Site Grayscale', 'site-grayscale-toggle' ); ?></h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'sgtgle_settings' );
				do_settings_sections( 'sgtgle_settings' );
				submit_button();
				?>
			</form>
			<p><?php echo esc_html__( 'Visitors can toggle grayscale from the floating button (if enabled) or the [grayscale_toggle] shortcode.', 'site-grayscale-toggle' ); ?></p>
		</div>
		<?php
	}
}

new SGTGLE_Site_Grayscale_Toggle();
