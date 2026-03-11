export interface UserCredentials {
    email: string;
    password: string;
}

export interface SetupUserCredentials extends UserCredentials {
    storageStatePath: string;
}

// ── Setup user (Auth0 login — used by dekkpro.setup.ts) ─────────────────────
export const SETUP_USER: SetupUserCredentials = {
    email           : 'phuongthao2012@gmail.com',
    password        : 'Dekkpro1!',
    storageStatePath: 'fixtures/.auth/dekkpro-storageState.json',
};

// ── Thao user (used by FullResSalePriceFlow, AlternativeAddressFlow) ─────────
export const THAO_USER: UserCredentials = {
    email   : 'thao@dekkpro.no',
    password: 'Th@0Th@0',
};

// ── All credentials — useful for data-driven login tests ────────────────────
export const ALL_USERS: UserCredentials[] = [
    SETUP_USER,
    THAO_USER,
];
