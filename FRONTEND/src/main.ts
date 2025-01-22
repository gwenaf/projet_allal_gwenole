import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { CartState } from './store/cart.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore([CartState]),
    provideHttpClient(),
    importProvidersFrom(
      NgxsReduxDevtoolsPluginModule.forRoot()
    )
  ]
})
.catch(err => console.error(err));
