/* StartWise — Supabase client + thin auth helpers (Stage 2)
   The publishable key is safe to ship in client code; security is enforced
   by the database's Row Level Security rules. */
(function () {
  var SUPABASE_URL = "https://dnmxgqlufcgwpvqnixyq.supabase.co";
  var SUPABASE_KEY = "sb_publishable_vNTbj0UayERO-IVx4MOKIA_DgMf0bej";

  if (!window.supabase || !window.supabase.createClient) {
    console.error("[StartWise] Supabase library failed to load.");
    window.SW = { ready: false };
    return;
  }
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  window.SW = {
    ready: true,
    sb: sb,
    signUp: function (email, password) {
      return sb.auth.signUp({ email: (email || "").trim(), password: password });
    },
    signIn: function (email, password) {
      return sb.auth.signInWithPassword({ email: (email || "").trim(), password: password });
    },
    signOut: function () { return sb.auth.signOut(); },
    getSession: function () { return sb.auth.getSession(); },
    onAuthChange: function (cb) { return sb.auth.onAuthStateChange(cb); },
    createWorkspace: function (name) { return sb.rpc("create_workspace", { p_name: name }); }
  };
})();
