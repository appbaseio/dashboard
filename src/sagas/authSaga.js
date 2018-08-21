import { take, call, put } from 'redux-saga/effects';

import { USER } from '../constants';
import { getUser } from '../utils';
import { setUser, setUserError } from '../actions';

function* authWorker() {
	try {
		const user = yield call(getUser);
		yield put(setUser(user));
	} catch (e) {
		yield put(setUserError(e));
	}
}

export default function* authSaga() {
	yield take(USER.LOAD);
	yield call(authWorker);
}
