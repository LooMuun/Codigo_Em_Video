import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

type AnySession = any;

function persistUserFromSession(session: AnySession | null) {
	if (session && session.user) {
		const user = session.user as any;
		const avatar = user.user_metadata?.avatar_url
			?? user.raw_user_meta_data?.avatar_url
			?? user.user_metadata?.picture
			?? null;

		const simpleUser = {
			id: user.id,
			email: user.email,
			avatar_url: avatar,
			user_metadata: user.user_metadata ?? null,
		};

		try {
			localStorage.setItem("user", JSON.stringify(simpleUser));
		} catch (e) {
			console.warn("Could not persist user to localStorage", e);
		}

		if (session.access_token) {
			try {
				localStorage.setItem("token", session.access_token);
			} catch (e) {
				console.warn("Could not persist token to localStorage", e);
			}
		}
	} else {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	}
}

export async function initSupabaseAuthListener() {
	try {
		const { data } = await supabase.auth.getSession();
		const session = (data as any)?.session ?? null;
		persistUserFromSession(session);
	} catch (e) {
		// ignore
	}

	supabase.auth.onAuthStateChange((_event, payload: any) => {
		const session = payload?.session ?? null;
		persistUserFromSession(session);
	});
}