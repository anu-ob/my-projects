import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
  {
    path: '_corporate',
    loadChildren: () =>
      import('./corporate/corporate.module').then(m => m.CorporateModule)
  },
  {
    path: '_user',
    loadChildren: () =>
      import('./candidate/candidate.module').then(m => m.CandidateModule)
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }

]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
