module.exports = {
  plugins: {
    ...(process.env.TW_ENABLED === 'true' ? { tailwindcss: {} } : {}),
    autoprefixer: {},
  },
}