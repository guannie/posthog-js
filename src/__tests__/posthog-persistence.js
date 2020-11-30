import { PostHogPersistence } from '../posthog-persistence'

given('lib', () => Object.assign(new PostHogPersistence({ name: 'bla', persistence: 'cookie' }), given.overrides))

fdescribe('persistence', () => {
    it('should set referrer', () => {
        // Initial visit
        given.lib.update_referrer_info('https://www.google.com')

        expect(given.lib.props['$initial_referring_domain']).toBe('www.google.com')
        expect(given.lib.props['$referring_domain']).toBe('www.google.com')
        expect(given.lib.props['$referrer']).toBe('https://www.google.com')

        //subsequent visit
        given.lib.update_referrer_info('https://www.facebook.com')
        // first touch
        expect(given.lib.props['$initial_referring_domain']).toBe('www.google.com')

        // last touch
        expect(given.lib.props['$referring_domain']).toBe('www.facebook.com')
        expect(given.lib.props['$referrer']).toBe('https://www.facebook.com')

        // page visit that doesn't have direct referrer
        given.lib.update_referrer_info('')
        expect(given.lib.props['$initial_referring_domain']).toBe('www.google.com')
        // last touch should still be set to facebook
        expect(given.lib.props['$referring_domain']).toBe('www.facebook.com')
        expect(given.lib.props['$referrer']).toBe('https://www.facebook.com')
    })
})
