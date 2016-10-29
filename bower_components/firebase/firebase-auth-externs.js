/**
 * @fileoverview Firebase Auth API.
 * Version: 3.5.2
 *
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @externs
 */

/**
 * Gets the Auth object for the default App or a given App.
 *
 * Usage:
 *
 *   firebase.auth()
 *   firebase.auth(app)
 *
 * @namespace
 * @param {!firebase.app.App=} app
 * @return {!firebase.auth.Auth}
 */
firebase.auth = function(app) {};

/**
 * Interface that represents the credentials returned by an auth provider.
 * Implementations specify the details about each auth provider's credential
 * requirements.
 *
 * @interface
 */
firebase.auth.AuthCredential = function() {};

/**
 * The authentication provider ID for the credential.
 * For example, 'facebook.com', or 'google.com'.
  *
  * @type {string}
  */
firebase.auth.AuthCredential.prototype.provider;


/**
 * Gets the Firebase Auth Service object for an App.
 *
 * Usage:
 *
 *   app.auth()
 *
 * @return {!firebase.auth.Auth}
 */
firebase.app.App.prototype.auth = function() {};


/**
 * User profile information, visible only to the Firebase project's
 * apps.
 *
 * @interface
 */
firebase.UserInfo = function() {};

/**
 * The user's unique ID.
 *
 * @type {string}
 */
firebase.UserInfo.prototype.uid;

/**
 * The authentication provider ID for the current user.
 * For example, 'facebook.com', or 'google.com'.
 *
 * @type {string}
 */
firebase.UserInfo.prototype.providerId;

/**
 * The user's email address (if available).
 * @type {?string}
 */
firebase.UserInfo.prototype.email;

/**
 * The user's display name (if available).
 *
 * @type {?string}
 */
firebase.UserInfo.prototype.displayName;

/**
 * The URL of the user's profile picture (if available).
 *
 * @type {?string}
 */
firebase.UserInfo.prototype.photoURL;

/**
 * A user account.
 *
 * @interface
 * @extends {firebase.UserInfo}
 */
firebase.User;

/** @type {boolean} */
firebase.User.prototype.isAnonymous;

/**
 * True if the user's email address has been verified.
 * @type {boolean}
 */
firebase.User.prototype.emailVerified;

/**
 * Additional provider-specific information about the user.
 * @type {!Array<firebase.UserInfo>}
 */
firebase.User.prototype.providerData;

/**
 * A refresh token for the user account. Use only for advanced scenarios that
 * require explicitly refreshing tokens.
 * @type {string}
 */
firebase.User.prototype.refreshToken;

/**
 * Returns a JWT token used to identify the user to a Firebase service.
 *
 * Returns the current token if it has not expired, otherwise this will
 * refresh the token and return a new one.
 *
 * @param {boolean=} opt_forceRefresh Force refresh regardless of token
 *     expiration.
 * @return {!firebase.Promise<string>}
 */
firebase.User.prototype.getToken = function(opt_forceRefresh) {};

/**
 * Refreshes the current user, if signed in.
 *
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.reload = function() {};

/**
 * Sends a verification email to a user.
 *
 * The verification process is completed by calling
 * {@link firebase.auth.Auth#applyActionCode}
 *
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.sendEmailVerification = function() {};


/**
 * Links the user account with the given credentials.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/provider-already-linked</dt>
 * <dd>Thrown if the provider has already been linked to the user. This error is
 *     thrown even if this is not the same provider's account that is currently
 *     linked to the user.</dd>
 * <dt>auth/invalid-credential</dt>
 * <dd>Thrown if the provider's credential is not valid. This can happen if it
 *     has already expired when calling link, or if it used invalid token(s).
 *     Please refer to the Guide, under the provider's section you tried to
 *     link, and make sure you pass in the correct parameter to the credential
 *     method.</dd>
 * <dt>auth/credential-already-in-use</dt>
 * <dd>Thrown if the account corresponding to the credential already exists
 *     among your users, or is already linked to a Firebase User.
 *     For example, this error could be thrown if you are upgrading an anonymous
 *     user to a Google user by linking a Google credential to it and the Google
 *     credential used is already associated with an existing Firebase Google
 *     user.
 *     An <code>error.email</code> and <code>error.credential</code>
 *     ({@link firebase.auth.AuthCredential}) fields are also provided. You can
 *     recover from this error by signing in with that credential directly via
 *     {@link firebase.auth.Auth#signInWithCredential}.</dd>
 * <dt>auth/email-already-in-use</dt>
 * <dd>Thrown if the email corresponding to the credential already exists
 *     among your users. When thrown while linking a credential to an existing
 *     user, an <code>error.email</code> and <code>error.credential</code>
 *     ({@link firebase.auth.AuthCredential}) fields are also provided.
 *     You have to link the credential to the existing user with that email if
 *     you wish to continue signing in with that credential. To do so, call
 *     {@link firebase.auth.Auth#fetchProvidersForEmail}, sign in to
 *     <code>error.email</code> via one of the providers returned and then
 *     {@link firebase.User#link} the original credential to that newly signed
 *     in user.</dd>
 * <dt>auth/operation-not-allowed</dt>
 * <dd>Thrown if you have not enabled the provider in the Firebase Console. Go
 *     to the Firebase Console for your project, in the Auth section and the
 *     <strong>Sign in Method</strong> tab and configure the provider.</dd>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email used in a
 *     {@link firebase.auth.EmailAuthProvider#credential} is invalid.</dd>
 * <dt>auth/wrong-password</dt>
 * <dd>Thrown if the password used in a
 *     {@link firebase.auth.EmailAuthProvider#credential} is not correct or when
 *     the user associated with the email does not have a password.</dd>
 * </dl>
 *
 * @param {!firebase.auth.AuthCredential} credential The auth credential.
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.User.prototype.link = function(credential) {};


/**
 * Unlinks a provider from a user account.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/no-such-provider</dt>
 * <dd>Thrown if the user does not have this provider linked or when the
 *     provider ID given does not exist.</dd>
 * </dt>
 *
 * @param {string} providerId
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.User.prototype.unlink = function(providerId) {};


/**
 * Re-authenticates a user using a fresh credential. Use before operations
 * such as {@link firebase.User#updatePassword} that require tokens from recent
 * sign-in attempts.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/user-mismatch</dt>
 * <dd>Thrown if the credential given does not correspond to the user.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if the credential given does not correspond to any existing user.
 *     </dd>
 * <dt>auth/invalid-credential</dt>
 * <dd>Thrown if the provider's credential is not valid. This can happen if it
 *     has already expired when calling link, or if it used invalid token(s).
 *     Please refer to the Guide, under the provider's section you tried to
 *     link, and make sure you pass in the correct parameter to the credential
 *     method.</dd>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email used in a
 *     {@link firebase.auth.EmailAuthProvider#credential} is invalid.</dd>
 * <dt>auth/wrong-password</dt>
 * <dd>Thrown if the password used in a
 *     {@link firebase.auth.EmailAuthProvider#credential} is not correct or when
 *     the user associated with the email does not have a password.</dd>
 * </dl>
 *
 * @param {!firebase.auth.AuthCredential} credential
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.reauthenticate = function(credential) {};


/**
 * Updates the user's email address.
 *
 * An email will be sent to the original email address (if it was set) that
 * allows to revoke the email address change, in order to protect them from
 * account hijacking.
 *
 * <b>Important:</b> this is a security sensitive operation that requires the
 * user to have recently signed in. If this requirement isn't met, ask the user
 * to authenticate again and then call {@link firebase.User#reauthenticate}.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email used is invalid.</dd>
 * <dt>auth/email-already-in-use</dt>
 * <dd>Thrown if the email is already used by another user.</dd>
 * <dt>auth/requires-recent-login</dt>
 * <dd>Thrown if the user's last sign-in time does not meet the security
 *     threshold. Use {@link firebase.User#reauthenticate} to resolve. This does
 *     not apply if the user is anonymous.</dd>
 * </dl>
 *
 * @param {string} newEmail The new email address.
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.updateEmail = function(newEmail) {};


/**
 * Updates the user's password.
 *
 * <b>Important:</b> this is a security sensitive operation that requires the
 * user to have recently signed in. If this requirement isn't met, ask the user
 * to authenticate again and then call {@link firebase.User#reauthenticate}.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/weak-password</dt>
 * <dd>Thrown if the password is not strong enough.</dd>
 * <dt>auth/requires-recent-login</dt>
 * <dd>Thrown if the user's last sign-in time does not meet the security
 *     threshold. Use {@link firebase.User#reauthenticate} to resolve. This does
 *     not apply if the user is anonymous.</dd>
 * </dl>
 *
 * @param {string} newPassword
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.updatePassword = function(newPassword) {};


/**
 * Updates a user's profile data.
 *
 * @example
 * // Updates the user attributes:
 * user.updateProfile({
 *   displayName: "Jane Q. User",
 *   photoURL: "https://example.com/jane-q-user/profile.jpg"
 * }).then(function() {
 *   // Profile updated successfully!
 *   // "Jane Q. User"
 *   var displayName = user.displayName;
 *   // "https://example.com/jane-q-user/profile.jpg"
 *   var photoURL = user.photoURL;
 * }, function(error) {
 *   // An error happened.
 * });
 *
 * // Passing a null value will delete the current attribute's value, but not
 * // passing a property won't change the current attribute's value:
 * // Let's say we're using the same user than before, after the update.
 * user.updateProfile({photoURL: null}).then(function() {
 *   // Profile updated successfully!
 *   // "Jane Q. User", hasn't changed.
 *   var displayName = user.displayName;
 *   // Now, this is null.
 *   var photoURL = user.photoURL;
 * }, function(error) {
 *   // An error happened.
 * });
 *
 * @param {!{displayName: ?string, photoURL: ?string}} profile The profile's
 *     displayName and photoURL to update.
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.updateProfile = function(profile) {};


/**
 * Deletes and signs out the user.
 *
 * <b>Important:</b> this is a security sensitive operation that requires the
 * user to have recently signed in. If this requirement isn't met, ask the user
 * to authenticate again and then call {@link firebase.User#reauthenticate}.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/requires-recent-login</dt>
 * <dd>Thrown if the user's last sign-in time does not meet the security
 *     threshold. Use {@link firebase.User#reauthenticate} to resolve. This does
 *     not apply if the user is anonymous.</dd>
 * </dl>
 *
 * @return {!firebase.Promise<void>}
 */
firebase.User.prototype.delete = function() {};


/**
 * Checks a password reset code sent to the user by email or other out-of-band
 * mechanism.
 *
 * Returns the user's email address if valid.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/expired-action-code</dt>
 * <dd>Thrown if the password reset code has expired.</dd>
 * <dt>auth/invalid-action-code</dt>
 * <dd>Thrown if the password reset code is invalid. This can happen if the code
 *     is malformed or has already been used.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user corresponding to the given password reset code has
 *     been disabled.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if there is no user corresponding to the password reset code. This
 *     may have happened if the user was deleted between when the code was
 *     issued and when this method was called.</dd>
 * </dl>
 *
 * @param {string} code A verification code sent to the user.
 * @return {!firebase.Promise<string>}
 */
firebase.auth.Auth.prototype.verifyPasswordResetCode = function(code) {};


/**
 * A response from {@link firebase.auth.Auth#checkActionCode}.
 *
 * @interface
 */
firebase.auth.ActionCodeInfo = function() {};


/**
 * The email address associated with the action code.
 *
 * @typedef {{
 *   email: string
 * }}
 */
firebase.auth.ActionCodeInfo.prototype.data;


/**
 * Checks a verification code sent to the user by email or other out-of-band
 * mechanism.
 *
 * Returns metadata about the code.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/expired-action-code</dt>
 * <dd>Thrown if the action code has expired.</dd>
 * <dt>auth/invalid-action-code</dt>
 * <dd>Thrown if the action code is invalid. This can happen if the code is
 *     malformed or has already been used.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user corresponding to the given action code has been
 *     disabled.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if there is no user corresponding to the action code. This may
 *     have happened if the user was deleted between when the action code was
 *     issued and when this method was called.</dd>
 * </dl>
 *
 * @param {string} code A verification code sent to the user.
 * @return {!firebase.Promise<!firebase.auth.ActionCodeInfo>}
 */
firebase.auth.Auth.prototype.checkActionCode = function(code) {};


/**
 * Applies a verification code sent to the user by email or other out-of-band
 * mechanism.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/expired-action-code</dt>
 * <dd>Thrown if the action code has expired.</dd>
 * <dt>auth/invalid-action-code</dt>
 * <dd>Thrown if the action code is invalid. This can happen if the code is
 *     malformed or has already been used.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user corresponding to the given action code has been
 *     disabled.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if there is no user corresponding to the action code. This may
 *     have happened if the user was deleted between when the action code was
 *     issued and when this method was called.</dd>
 * </dl>
 *
 * @param {string} code A verification code sent to the user.
 * @return {!firebase.Promise<void>}
 */
firebase.auth.Auth.prototype.applyActionCode = function(code) {};


/**
 * The Firebase Auth service interface.
 *
 * @interface
 */
firebase.auth.Auth = function() {};

/**
 * The App associated with the Auth service instance.
 *
 * @type {!firebase.app.App}
 */
firebase.auth.Auth.prototype.app;

/**
 * The currently signed-in user (or null).
 *
 * @type {firebase.User|null}
 */
firebase.auth.Auth.prototype.currentUser;

/**
 * Creates a new user account associated with the specified email address and
 * password.
 *
 * On successful creation of the user account, this user will also be
 * signed in to your application.
 *
 * User account creation can fail if the account already exists or the password
 * is invalid.
 *
 * Note: The email address acts as a unique identifier for the user and
 * enables an email-based password reset.  This function will create
 * a new user account and set the initial user password.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/email-already-in-use</dt>
 * <dd>Thrown if there already exists an account with the given email
 *     address.</dd>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email address is not valid.</dd>
 * <dt>auth/operation-not-allowed</dt>
 * <dd>Thrown if email/password accounts are not enabled. Enable email/password
 *     accounts in the Firebase Console, under the Auth tab.</dd>
 * <dt>auth/weak-password</dt>
 * <dd>Thrown if the password is not strong enough.</dd>
 * </dl>
 *
 * @param {string} email The user's email address.
 * @param {string} password The user's chosen password.
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.auth.Auth.prototype.createUserWithEmailAndPassword =
    function(email, password) {};


/**
 * Gets the list of provider IDs that can be used to sign in for the given email
 * address. Useful for an "identifier-first" sign-in flow.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email address is not valid.</dd>
 * </dl>
 *
 * @param {string} email An email address.
 * @return {!firebase.Promise<!Array<string>>}
 */
firebase.auth.Auth.prototype.fetchProvidersForEmail = function(email) {};


/**
 * Adds an observer for auth state changes.
 *
 * @param {!Object|function(?firebase.User)}
 *     nextOrObserver An observer object or a function triggered on change.
 * @param {function(!firebase.auth.Error)=} opt_error Optional A function
 *     triggered on auth error.
 * @param {function()=} opt_completed Optional A function triggered when the
 *     observer is removed.
 * @return {!function()} The unsubscribe function for the observer.
 */
firebase.auth.Auth.prototype.onAuthStateChanged = function(
    nextOrObserver, opt_error, opt_completed) {};


/**
 * Sends a password reset email to the given email address.
 *
 * To complete the password reset, call
 * {@link firebase.auth.Auth#confirmPasswordReset} with the code supplied in the
 * email sent to the user, along with the new password specified by the user.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email address is not valid.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if there is no user corresponding to the email address.</dd>
 * </dl>
 *
 * @param {string} email The email address with the password to be reset.
 * @return {!firebase.Promise<void>}
 */
firebase.auth.Auth.prototype.sendPasswordResetEmail = function(email) {};


/**
 * Completes the password reset process, given a confirmation code and new
 * password.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/expired-action-code</dt>
 * <dd>Thrown if the password reset code has expired.</dd>
 * <dt>auth/invalid-action-code</dt>
 * <dd>Thrown if the password reset code is invalid. This can happen if the
 *     code is malformed or has already been used.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user corresponding to the given password reset code has
 *     been disabled.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if there is no user corresponding to the password reset code. This
 *     may have happened if the user was deleted between when the code was
 *     issued and when this method was called.</dd>
 * <dt>auth/weak-password</dt>
 * <dd>Thrown if the new password is not strong enough.</dd>
 * </dl>
 *
 * @param {string} code The confirmation code send via email to the user.
 * @param {string} newPassword The new password.
 * @return {!firebase.Promise<void>}
 */
firebase.auth.Auth.prototype.confirmPasswordReset =
    function(code, newPassword) {};

/**
 * Asynchronously signs in with the given credentials.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/account-exists-with-different-credential</dt>
 * <dd>Thrown if there already exists an account with the email address
 *     asserted by the credential. Resolve this by calling
 *     {@link firebase.auth.Auth#fetchProvidersForEmail} and then asking the
 *     user to sign in using one of the returned providers. Once the user is
 *     signed in, the original credential can be linked to the user with
 *     {@link firebase.User#link}.</dd>
 * <dt>auth/invalid-credential</dt>
 * <dd>Thrown if the credential is malformed or has expired.</dd>
 * <dt>auth/operation-not-allowed</dt>
 * <dd>Thrown if the type of account corresponding to the credential
 *     is not enabled. Enable the account type in the Firebase Console, under
 *     the Auth tab.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user corresponding to the given credential has been
 *     disabled.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if signing in with a credential from
 *     {@link firebase.auth.EmailAuthProvider#credential} and there is no user
 *     corresponding to the given email. </dd>
 * <dt>auth/wrong-password</dt>
 * <dd>Thrown if signing in with a credential from
 *     {@link firebase.auth.EmailAuthProvider#credential} and the password is
 *     invalid for the given email, or if the account corresponding to the email
 *     does not have a password set.</dd>
 * </dl>
 *
 * @param {!firebase.auth.AuthCredential} credential The auth credential.
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.auth.Auth.prototype.signInWithCredential = function(credential) {};


/**
 * Asynchronously signs in using a custom token.
 *
 * Custom tokens are used to integrate Firebase Auth with existing auth systems,
 * and must be generated by the auth backend.
 *
 * Fails with an error if the token is invalid, expired, or not accepted by the
 * Firebase Auth service.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/custom-token-mismatch</dt>
 * <dd>Thrown if the custom token is for a different Firebase App.</dd>
 * <dt>auth/invalid-custom-token</dt>
 * <dd>Thrown if the custom token format is incorrect.</dd>
 * </dl>
 *
 * @param {string} token The custom token to sign in with.
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.auth.Auth.prototype.signInWithCustomToken = function(token) {};


/**
 * Asynchronously signs in using an email and password.
 *
 * Fails with an error if the email address and password do not match.
 *
 * Note: The user's password is NOT the password used to access the user's email
 * account. The email address serves as a unique identifier for the user, and
 * the password is used to access the user's account in your Firebase project.
 *
 * See also: {@link firebase.auth.Auth#createUserWithEmailAndPassword}.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/invalid-email</dt>
 * <dd>Thrown if the email address is not valid.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user corresponding to the given email has been
 *     disabled.</dd>
 * <dt>auth/user-not-found</dt>
 * <dd>Thrown if there is no user corresponding to the given email.</dd>
 * <dt>auth/wrong-password</dt>
 * <dd>Thrown if the password is invalid for the given email, or the account
 *     corresponding to the email does not have a password set.</dd>
 * </dl>
 *
 * @param {string} email The users email address.
 * @param {string} password The users password.
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.auth.Auth.prototype.signInWithEmailAndPassword =
    function(email, password) {};


/**
 * Asynchronously signs in as an anonymous user.
 *
 * If there is already an anonymous user signed in, that user will be returned;
 * otherwise, a new anonymous user identity will be created and returned.
 *
 * <h4>Error Codes</h4>
 * <dl>
 * <dt>auth/operation-not-allowed</dt>
 * <dd>Thrown if anonymous accounts are not enabled. Enable anonymous accounts
 *     in the Firebase Console, under the Auth tab.</dd>
 * </dl>
 *
 * @return {!firebase.Promise<!firebase.User>}
 */
firebase.auth.Auth.prototype.signInAnonymously = function() {};


/**
 * A structure containing a User and an AuthCredential.
 *
 * @typedef {{
 *   user: ?firebase.User,
 *   credential: ?firebase.auth.AuthCredential
 * }}
 */
firebase.auth.UserCredential;

/**
 * Signs out the current user.
 *
 * @return {!firebase.Promise<void>}
 */
firebase.auth.Auth.prototype.signOut = function() {};


/**
 * An authentication error.
 * For method-specific error codes, refer to the specific methods in the
 * documentation. For common error codes, check the reference below. Use {@link
 * firebase.auth.Error#code} to get the specific error code. For a detailed
 * message, use {@link firebase.auth.Error#message}.
 * Errors with the code <strong>auth/account-exists-with-different-credential
 * </strong> will have the additional fields <strong>email</strong> and <strong>
 * credential</strong> which are needed to provide a way to resolve these
 * specific errors. Refer to {@link firebase.auth.Auth#signInWithPopup} for more
 * information.
 *
 * <h4>Common Error Codes</h4>
 * <dl>
 * <dt>auth/app-deleted</dt>
 * <dd>Thrown if the instance of FirebaseApp has been deleted.</dd>
 * <dt>auth/app-not-authorized</dt>
 * <dd>Thrown if the app identified by the domain where it's hosted, is not
 *     authorized to use Firebase Authentication with the provided API key.
 *     Review your key configuration in the Google API console.</dd>
 * <dt>auth/argument-error</dt>
 * <dd>Thrown if a method is called with incorrect arguments.</dd>
 * <dt>auth/invalid-api-key</dt>
 * <dd>Thrown if the provided API key is invalid. Please check that you have
 *     copied it correctly from the Firebase Console.</dd>
 * <dt>auth/invalid-user-token</dt>
 * <dd>Thrown if the user's credential is no longer valid. The user must sign in
 *     again.</dd>
 * <dt>auth/network-request-failed</dt>
 * <dd>Thrown if a network error (such as timeout, interrupted connection or
 *     unreachable host) has occurred.</dd>
 * <dt>auth/operation-not-allowed</dt>
 * <dd>Thrown if you have not enabled the provider in the Firebase Console. Go
 *     to the Firebase Console for your project, in the Auth section and the
 *     <strong>Sign in Method</strong> tab and configure the provider.</dd>
 * <dt>auth/requires-recent-login</dt>
 * <dd>Thrown if the user's last sign-in time does not meet the security
 *     threshold. Use {@link firebase.User#reauthenticate} to resolve. This does
 *     not apply if the user is anonymous.</dd>
 * <dt>auth/too-many-requests</dt>
 * <dd>Thrown if requests are blocked from a device due to unusual activity.
 *     Trying again after some delay would unblock.</dd>
 * <dt>auth/unauthorized-domain</dt>
 * <dd>Thrown if the app domain is not authorized for OAuth operations for your
 *     Firebase project. Edit the list of authorized domains from the Firebase
 *     console.</dd>
 * <dt>auth/user-disabled</dt>
 * <dd>Thrown if the user account has been disabled by an administrator.
 *     Accounts can be enabled or disabled in the Firebase Console, the Auth
 *     section and Users subsection.</dd>
 * <dt>auth/user-token-expired</dt>
 * <dd>Thrown if the user's credential has expired. This could also be thrown if
 *     a user has been deleted. Prompting the user to sign in again should
 *     resolve this for either case.</dd>
 * <dt>auth/web-storage-unsupported</dt>
 * <dd>Thrown if the browser does not support web storage or if the user
 *     disables them.</dd>
 * </dl>
 *
 * @interface
 */
firebase.auth.Error = function() {};

/**
 * Unique error code.
 *
 * @type {string}
 */
firebase.auth.Error.prototype.code;

/**
 * Complete error message.
 *
 * @type {string}
 */
firebase.auth.Error.prototype.message;


//
// List of Auth Providers.
//


/**
 * Interface that represents an auth provider.
 *
 * @interface
 */
firebase.auth.AuthProvider = function() {};

/** @type {string} */
firebase.auth.AuthProvider.prototype.providerId;

/**
 * Facebook auth provider.
 * @constructor
 * @implements {firebase.auth.AuthProvider}
 */
firebase.auth.FacebookAuthProvider = function() {};

/** @type {string} */
firebase.auth.FacebookAuthProvider.PROVIDER_ID;

/**
 * @param {string} token Facebook access token.
 * @return {!firebase.auth.AuthCredential} The auth provider credential.
 */
firebase.auth.FacebookAuthProvider.credential = function(token) {};

/** @type {string} */
firebase.auth.FacebookAuthProvider.prototype.providerId;

/**
 * @param {string} scope Facebook OAuth scope.
 */
firebase.auth.FacebookAuthProvider.prototype.addScope = function(scope) {};

/**
 * Sets the OAuth custom parameters to pass in a Facebook OAuth request for
 * popup and redirect sign-in operations.
 * Valid parameters include 'auth_type', 'display' and 'locale'.
 * For a detailed list, check the
 * {@link https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/ Facebook}
 * documentation.
 * Reserved required OAuth 2.0 parameters such as 'client_id', 'redirect_uri',
 * 'scope', 'response_type' and 'state' are not allowed and will be ignored.
 * @param {!Object} customOAuthParameters The custom OAuth parameters to pass
 *     in the OAuth request.
 */
firebase.auth.FacebookAuthProvider.prototype.setCustomParameters =
    function(customOAuthParameters) {};


/**
 * Github auth provider.
 * @constructor
 * @implements {firebase.auth.AuthProvider}
 */
firebase.auth.GithubAuthProvider = function() {};

/** @type {string} */
firebase.auth.GithubAuthProvider.PROVIDER_ID;

/**
 * @param {string} token Github access token.
 * @return {!firebase.auth.AuthCredential} The auth provider credential.
 */
firebase.auth.GithubAuthProvider.credential = function(token) {};

/** @type {string} */
firebase.auth.GithubAuthProvider.prototype.providerId;

/**
 * @param {string} scope Github OAuth scope.
 */
firebase.auth.GithubAuthProvider.prototype.addScope = function(scope) {};

/**
 * Sets the OAuth custom parameters to pass in a GitHub OAuth request for popup
 * and redirect sign-in operations.
 * Valid parameters include 'allow_signup'.
 * For a detailed list, check the
 * {@link https://developer.github.com/v3/oauth/ GitHub} documentation.
 * Reserved required OAuth 2.0 parameters such as 'client_id', 'redirect_uri',
 * 'scope', 'response_type' and 'state' are not allowed and will be ignored.
 * @param {!Object} customOAuthParameters The custom OAuth parameters to pass
 *     in the OAuth request.
 */
firebase.auth.GithubAuthProvider.prototype.setCustomParameters =
    function(customOAuthParameters) {};


/**
 * Google auth provider.
 * @constructor
 * @implements {firebase.auth.AuthProvider}
 */
firebase.auth.GoogleAuthProvider = function() {};

/** @type {string} */
firebase.auth.GoogleAuthProvider.PROVIDER_ID;

/**
 * Creates a credential for Google. At least one of ID token and access token
 * is required.
 * @param {?string=} idToken Google ID token.
 * @param {?string=} accessToken Google access token.
 * @return {!firebase.auth.AuthCredential} The auth provider credential.
 */
firebase.auth.GoogleAuthProvider.credential = function(idToken, accessToken) {};

/** @type {string} */
firebase.auth.GoogleAuthProvider.prototype.providerId;

/**
 * @param {string} scope Google OAuth scope.
 */
firebase.auth.GoogleAuthProvider.prototype.addScope = function(scope) {};

/**
 * Sets the OAuth custom parameters to pass in a Google OAuth request for popup
 * and redirect sign-in operations.
 * Valid parameters include 'hd', 'hl', 'include_granted_scopes', 'login_hint'
 * and 'prompt'.
 * For a detailed list, check the
 * {@link https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters Google}
 * documentation.
 * Reserved required OAuth 2.0 parameters such as 'client_id', 'redirect_uri',
 * 'scope', 'response_type' and 'state' are not allowed and will be ignored.
 * @param {!Object} customOAuthParameters The custom OAuth parameters to pass
 *     in the OAuth request.
 */
firebase.auth.GoogleAuthProvider.prototype.setCustomParameters =
    function(customOAuthParameters) {};


/**
 * Twitter auth provider.
 * @constructor
 * @implements {firebase.auth.AuthProvider}
 */
firebase.auth.TwitterAuthProvider = function() {};

/** @type {string} */
firebase.auth.TwitterAuthProvider.PROVIDER_ID;

/**
 * @param {string} token Twitter access token.
 * @param {string} secret Twitter secret.
 * @return {!firebase.auth.AuthCredential} The auth provider credential.
 */
firebase.auth.TwitterAuthProvider.credential = function(token, secret) {};

/** @type {string} */
firebase.auth.TwitterAuthProvider.prototype.providerId;

/**
 * Sets the OAuth custom parameters to pass in a Twitter OAuth request for popup
 * and redirect sign-in operations.
 * Valid parameters include 'lang'.
 * Reserved required OAuth 1.0 parameters such as 'oauth_consumer_key',
 * 'oauth_token', 'oauth_signature', etc are not allowed and will be ignored.
 * @param {!Object} customOAuthParameters The custom OAuth parameters to pass
 *     in the OAuth request.
 */
firebase.auth.TwitterAuthProvider.prototype.setCustomParameters =
    function(customOAuthParameters) {};


/**
 * Email and password auth provider implementation.
 * @constructor
 * @implements {firebase.auth.AuthProvider}
 */
firebase.auth.EmailAuthProvider = function() {};

/** @type {string} */
firebase.auth.EmailAuthProvider.PROVIDER_ID;

/**
 * @param {string} email Email address.
 * @param {string} password User account password.
 * @return {!firebase.auth.AuthCredential} The auth provider credential.
 */
firebase.auth.EmailAuthProvider.credential = function(email, password) {};

/** @type {string} */
firebase.auth.EmailAuthProvider.prototype.providerId;
