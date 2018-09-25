# Forms

## Controller

Props:
- `entityLastSaveTime` - grabbed from entity's meta
- `submitting` - grabbed from entity's meta

Simplified code:
```flow js
// @flow
import * as React from 'react';
import { Redirect } from 'react-app-core'; // Not for react-router
import { Form, type FormProps } from '@saritasa/react-form';

import { featureNameRootPath } from '../../features/featureName/routes/paths';

export class Controller extends React.PureComponent<ControllerProps> {
  static defaultProps = {
    submitting: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.submitting) {
      return { submitTime: Date.now() };
    }

    return state;
  }

  state = { submitTime: 0 };
  /**
  * This should clear all info from store that was form-specific.
  * For example if there is some flag that is used for redirect,
  * you should clear it to allow user use 'go back' in history.
  */
  componentWillUnmount() {
    this.props.clearAllInfoFromStore();
  }

  /**
   * Method to generate properties for view part of component.
   */
  getViewProps(): $Exact<MyFormViewProps> {
    const { submitting, errorCode, errorText } = this.props;

    return {
      formName: 'NameToUseOnE2ETesting',
      error: submitting ? getErrorByErrorCodeOrErrorText() : null,
    };
  }

  getFormProps(): $Exact<FormPropsFromView> {
    const { submitting, onSubmit } = this.props;

    return {
      ...this.getViewProps(),
      onSubmit,
      submitting,
      component: View,
      fieldRules: fieldRulesFromNearFile,
      validate: validateFromNearFile,
    };
  }

  render() {
    if (!this.props.submitting) {
      if (this.props.entityLastSaveTime && this.props.entityLastSaveTime >= this.state.submitTime) {
        return React.createElement(
          Redirect.of(featureNameRootPath.getPath(), {
            // use push, cause without it user can't use `go back` from history.
            push: true,
            // someId is used as example for case if featureNameRootPath is like
            // '/feature-name/:someId/'
            someId: this.props.someId,
          }),
        );
      }
    }

    return React.createElement(Form, this.getFormProps());
  }
}
```


## Saga

```flow js
export function* saveSomething(action: $Call<typeof Action.saveSomething, any>): Saga<*> {
  try {
    const { data } = yield call(Api.saveSomething, action.payload);

    yield put(Action.setSomething(dtoToRecord(data)));
    yield put(Action.saveSomethingSuccess(action.payload.somethingId));
  } catch (anyError) {
    const error: Api.FetchTestError = anyError;

    yield put(Action.saveSomethingFailed({ somethingId: action.payload.somethingId, error }));
    yield call(delay, 5000);
    yield put(Action.clearError({ somethingId: action.payload.somethingId }));
  }
}

export function* saveSomethingSaga(): Saga<*> {
   yield takeEvery(ActionType.SAVE, saveSomething);
}
```

## Record

```flow js
const SomethingMetaRecord = Immutable.Record({
  savedAt: 0,
  updatedAt: 0,
  loading: false,
  saving: false,
  existed: true,
});
```


## Reducer

On saveSuccess:
 - update `savedAt`
 - update `updatedAt`
 - set `saving`, `loading`, `existed`
 
On loadSuccess:
 - update `loading`
 - set `saving`, `loading`, `existed`

On set:
 - update `updatedAt`
 - set entity



